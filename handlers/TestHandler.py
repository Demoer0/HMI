#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : ReportHandler.py
# @Author: Lin XiaoWen
# @DateTime  : 2018/01/11
# @Desc  : 专门用来测试调试的接口

import tornado.web
import tornado.ioloop
import tornado.httpserver
import tornado.httpclient
import tornado.options
import asyncio
import threading
import time
import json
import logging
import tornado.gen
from tornado.websocket import WebSocketHandler
from handlers import BaseHandler
from handlers import StaticDataHandler
from utils import CommandUtils
from utils import SocketUtils
from utils.XMLUtils import get_addresses

clients = {}  # 用于存储页面连接的，其长度等于不同的页面的数量
users = {}  # 用于存储websocket客户端连接的，其长度等于webdocket客户端的数量
command_container = {}  # 用于保存页面与对应的所需发送的指令
address_container = {}  # 用于保存页面数据点与其对应地址的
# datatype_container = {}    # 用于保存数据点数据类型的


recordDic = {}
class websocketHandler(WebSocketHandler):
    # users = set()  # 用来存放连接用户的容器

    # @tornado.gen.coroutine
    def open(self):
        print("%s connect sucess." % self.request.remote_ip)
        # self.write_message("Hello cient")

    @tornado.gen.coroutine
    def on_message(self, message):
        # 收到请求数据的指令，存入暂存变量，定时想主控请求数据，处理后再发送给前端
        try:
            yield self.prduceCommand(message)
        except Exception as e:
            print(e)
            print("a user has removed.")

    # @tornado.gen.coroutine
    def on_close(self):
        session = users[self]  # 获取到该链接对应的页面ID
        clients[session].remove(self)  # 删除clients中对应页面下的该连接

        if len(clients[session]) == 0:  # 再判断该页面所对应的集合是否为空，若为空，则移除该页面所对应的字典元素以及其对应的指令和mapping
            del clients[session]
            del command_container[session]
            del address_container[session]
            # del datatype_container[session]
        del users[self]  # 删除users中保存的该连接
        print('%s connect breaked.' % self.request.remote_ip)

    def check_origin(self, origin):
        return True  # 允许WebSocket的跨域请求

    def prduceCommand(self, message):
        try:
            # 处理前端页面传来的数据
            msg = json.loads(message)
            print("produce: ", msg)

            session = msg['sessionId']
            users[self] = session

            cm_from_website = msg['command']
            # print('command:', cm_from_website)
            points_name = msg['points_name']

            # 构造指令，并以{页面：指令}的方式进行存储，避免不同设备看同一页面所看到的数据不同步
            command, address_mapping = CommandUtils.constructCommand(cm_from_website, points_name)
            command_container[session] = command
            address_container[session] = address_mapping
            # datatype_container[session] = datatype_mapping
            # 以{页面1：[连接11, 连接12, ...], 页面2：[连接21, 连接22, ...], ...}的数据解构存储页面与连接数之间的关系
            # 存之前先判断clients中是否已经存在以该页面为key的元素
            if session in clients.keys():
                clients[session].add(self)
            else:
                clients[session] = set()
                clients[session].add(self)

        except tornado.websocket.WebSocketClosedError as e:
            logging.info(e)


# 启动另一个线程来进行推送
class messageHandler(threading.Thread):

    def run(self):
        try:
            # 加入一个全局的事件，使得数据推送这一线程能正常运行
            asyncio.set_event_loop(asyncio.new_event_loop())
            self.sendMessage(clients)
        except Exception as e:
            print("occur a exception: ", e)

    # 定时向主控请求数据并返回给前端

    def sendMessage(self, clients):
        while True:
            # print("clients: ", clients)
            # print("users: ", users)
            # print("the command are: ", command_container)

            if len(command_container) == len(clients):
                for session in clients:
                    if session in users.values():
                        command = command_container[session]  # 取出对应指令
                        rec = SocketUtils.requestSocket(command)  # 请求数据
                        data = CommandUtils.analyzeData(rec, command, address_container[session])  # 解析数据

                        # client.write_message(data)      # 发送数据
                        for client in clients[session]:
                            # print("the data to the front is: ", data)
                            if client in users:
                                client.write_message(data)
            else:
                continue
            time.sleep(1)

            if len(users) == 0:
                clients.clear()
                command_container.clear()
                address_container.clear()

    def join(self):
        raise RuntimeError


class historyRecordHandler(threading.Thread):

    def run(self):
        try:
            # 加入一个全局的事件，使得数据推送这一线程能正常运行
            # asyncio.set_event_loop(asyncio.new_event_loop())
            i = 0
            self.timerRun(i, recordDic)
       
        except Exception as e:
            print("occur a exception: ", e)


    def timerRun(self, q: object, recordDic: object = recordDic) -> object:
        """

        :rtype: object
        """
        #  向主控发送请求时间间隔
        timeInterval = 2
        # 数组长度
        arrayLength = 864
        # 当前时间获取
        curtime = int(time.time())
        # 得到第一个记录时间
        hourtime = curtime - (curtime % timeInterval)
        st = time.localtime(hourtime)
        timeData = time.strftime("%Y-%m-%d %H:%M:%S", st)
        # 向主控发送请求并返回数据
        recorddata = CommandUtils.sendHistoryMessage()
        # 字典里面嵌套数组
        for key in recorddata:
            recordDic[key] = []
        # 记录这个时间的数据
        CommandUtils.recordTimeData(timeData, recorddata, recordDic)
        # 时间推迟10s
        firstDelayTime = time.localtime(hourtime + timeInterval)
        delayTimeFormat = time.strftime("%Y-%m-%d %H:%M:%S", firstDelayTime)
        flag = 0
        while True:
            time.sleep(1)
            # 获取当前时间
            curtime = int(time.time())
            st1 = time.localtime(curtime)
            curtimeFormat = time.strftime("%Y-%m-%d %H:%M:%S", st1)
            # 如果时间到达设定时间
            if (curtimeFormat == delayTimeFormat) & (flag == 0):
                flag = 1
                # 向主控发送请求并返回数据
                recorddata =CommandUtils.sendHistoryMessage()
                # 如果数组长度不够,继续记录
                if len(recordDic[key]) < arrayLength:
                    recordDic = CommandUtils.recordTimeData(curtimeFormat, recorddata, recordDic)
                # 否则去掉最前面的数据,记录上当前的数据
                else:
                    for key in recorddata:
                        del recordDic[key][0]
                    recordDic = CommandUtils.recordTimeData(curtimeFormat, recorddata, recordDic)
            # 进行时间延时操作
            else:
                if flag == 1:
                    hourtime = hourtime + timeInterval
                    delayTime = time.localtime(hourtime + timeInterval)
                    delayTimeFormat = time.strftime("%Y-%m-%d %H:%M:%S", delayTime)
                    #time.sleep(6)
                    flag = 0
            if q == 1:
                break
        # q = 0
        print(recordDic)
        return recordDic

    # client.write_message(data)      # 发送数据

    # else:
    #     continue
    # time.sleep(1)

    def join(self):
        raise RuntimeError
