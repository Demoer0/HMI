#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : WebSocketHandler.py
# @Author: Lin XiaoWen
# @DateTime  : 2017/12/19
# @Desc  : webSocket接口，与前端交互实时数据

import logging
from logging.handlers import RotatingFileHandler
import tornado.web
import tornado.ioloop
import tornado.httpserver
import tornado.options
import os
import random
import datetime
import time
import json
import tornado.gen
from tornado.websocket import WebSocketHandler
from utils import CommandUtils
from utils import SocketUtils
from utils.XMLUtils import get_addresses



class webSocketHandler(WebSocketHandler):
    users = set()  # 用来存放连接用户的容器
    req = {}  # 存放页面请求的数据指令

    def open(self):
        self.users.add(self)  # 建立连接后添加用户到容器中
        print("%s connect success." % self.request.remote_ip)
        res = {'state': 'success'}
        self.write_message(res)  # 回复新建立连接的用户已连接成功

    @tornado.gen.coroutine
    def on_message(self, message):
        # 收到请求数据的指令，存入req，并回复给该用户，目前每隔三秒回复一次随机数
        print(str(message))
        msg = json.loads(message)
        self.req[self.request.remote_ip] = msg
        add = msg['data']
        cm = msg['command']
        command, mapping = CommandUtils.constructCommand(cm, add)
        print('command:', command)
        print('mapping:', str(mapping))
        if not command:
            print('command has error ')
            self.write_message({'state': 'error_cmd'})  # 构造出的指令有误
        while True:
            try:
                rec = SocketUtils.requestSocket(command)
                if not rec:
                    print('rec has error ')
                data = CommandUtils.analyzeData(rec, command, mapping)
                print(str(data))
                self.write_message(data)
                yield tornado.gen.sleep(3)
            except BaseException as e:
                print(e)
                # data['state'] = 'error_we'
                self.write_message(data)
                self.close()  # 有异常即关闭该异常连接
                break

        # while True:
        #     try:
        #         for x in lis:
        #             res['data'][x] = random.randint(0,1)
        #         res['state'] = 'success'
        #         self.write_message(res)
        #
        #         print('%s:回写数据给%s' % (datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), self.request.remote_ip))
        #         yield tornado.gen.sleep(3)
        #     except BaseException as e:
        #         print(e)
        #         res['state'] = 'error'
        #         self.write_message(res)
        #         self.close()  # 有异常即关闭该异常连接

    @tornado.gen.coroutine
    def on_close(self):
        self.users.remove(self)  # 用户关闭连接后从容器中移除用户
        print('%s connection breaked.' % self.request.remote_ip)

    def check_origin(self, origin):
        return True  # 允许WebSocket的跨域请求
