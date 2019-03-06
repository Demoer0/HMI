#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : FaultHandler.py
# @Author: Zhang hao
# @DateTime  : 2017/11/27 9:55
# @Desc  : 故障接口（仅作为测试用）

import logging
import os
from logging.handlers import RotatingFileHandler
from handlers import BaseHandler
from utils import CommandUtils, SocketUtils
from utils.CSVReader import read_csv
import time
from utils.CommandUtils import strToPoint



temp_list = []
shield_list = []
class CurrentFaultHandler(BaseHandler.BaseHandler):
    def get(self):

        date = time.strftime('%Y.%m.%d-%H:%M:%S', time.localtime(time.time()))
        cm = self.get_argument('command', None)
        # print('cm:', cm)
        if cm == '31':
            data_point = None

        command, mapping = CommandUtils.constructCommand(cm, data_point)
        print('command:', command)
        rec = SocketUtils.requestSocket(command)
        print('rec:', rec)
        data = CommandUtils.analyzeData(rec, command, mapping)
        cla = str(data.__class__)
        if not cla.startswith("<class 'list"):
            res = {'state': 'error', 'data': None}
        res = {'state': 'success', 'data': data}

        return self.finish(res)

class HistoricalFaultHandler(BaseHandler.BaseHandler):
    def get(self):
        global logger
        cm = self.get_argument('command', None)
        print('cm:', cm)
        if cm == '41':
            data_point = None
        command, mapping = CommandUtils.constructCommand(cm, data_point)
        print('command:', command)
        rec = SocketUtils.requestSocket(command)
        print('rec:', rec)
        data = CommandUtils.analyzeData(rec, command, mapping)
        cla = str(data.__class__)
        if not cla.startswith("<class 'list"):
            res = {'state': 'error', 'data': None}
        res = {'state': 'success', 'data': data}
        return self.finish(res)

class UserLogHandler(BaseHandler.BaseHandler):
    def get(self):
        res = {}
        with open(os.path.join(os.path.dirname(__file__), '../logs/modifylog.txt'), encoding='UTF-8') as m:
            fault_state = m.readlines()
            data = {}
            for i in range(len(fault_state)):
                data[(i + 1)] = fault_state[i].strip().split(',')
            print('data:', data)
        # 信息发送完成后，返回一个成功的状态描述
        res['state'] = 'success'
        res['data'] = data
        print('res:', res)
        return self.finish(res)

class FanLogHandler(BaseHandler.BaseHandler):
    def get(self):
        global logger
        cm = self.get_argument('command', None)
        print('cm:', cm)
        if cm == '51':
            data_point = None
        command, mapping = CommandUtils.constructCommand(cm, data_point)
        print('command:', command)
        rec = SocketUtils.requestSocket(command)
        print('rec:', rec)
        data = CommandUtils.analyzeData(rec, command, mapping)
        cla = str(data.__class__)
        if not cla.startswith("<class 'list"):
            res = {'state': 'error', 'data': None}
        res = {'state': 'success', 'data': data}
        return self.finish(res)
class FaultListHandler(BaseHandler.BaseHandler):
    def get(self):
        pass

    def post(self):
        cm = self.get_argument('command', None)
        temp_list.clear()
        print('cm:', cm)
        if cm == '61':
            data_point = None
        command, mapping = CommandUtils.constructCommand(cm, data_point)
        print('command:', command)
        rec = SocketUtils.requestSocket(command)
        print('rec:', rec)
        data = CommandUtils.analyzeData(rec, command, mapping)
        cla = str(data.__class__)
        if not cla.startswith("<class 'list"):
            res = {'state': 'error', 'data': None}
        res = {'state': 'success', 'data': data}
        
        temp_list.clear()
        shield_list.clear()
       
        temp_list.extend(data['user_log'])
        shield_list.extend(data['user_log'])
        
        return self.finish(res)

class FaultRestHandler(BaseHandler.BaseHandler):
    def get(self):
        pass

    def post(self):
        cm = self.get_argument('command', None)
        print('list1:', temp_list)
        NUM = self.get_argument("NUM")
        NUM = int(NUM)
        points_name = self.get_arguments("points_name[]")
        point_name = self.get_argument("point_name")
        print('NUM', NUM)
        print('cm:', cm)
        print('point_name:', point_name)
        print('list:', points_name)
        if cm == '71':
            temp_list[NUM] = point_name
            print('temp_list0', temp_list)
        command, mapping = CommandUtils.constructCommand(cm, temp_list)
        print('command:', command)
        rec = SocketUtils.requestSocket(command)
        print('rec:', rec)
        # mapping = None
        data = CommandUtils.analyzeData(rec, command, mapping)
        cla = str(data.__class__)
        temp_list.clear()
        shield_list.clear()
        if not cla.startswith("<class 'list"):
            res = {'state': 'error', 'data': None}
        res = {'state': 'success', 'data': data}
        print('li:', data)
        temp_list.extend(data['user_log'])
        shield_list.extend(data['user_log'])
        return self.finish(res)

    get = post
class FaultShieldHandler(BaseHandler.BaseHandler):
    def get(self):
        pass

    def post(self):
        if not shield_list:
            cm = '61'
            data_point = None
            command, mapping = CommandUtils.constructCommand(cm, data_point)
            # print('command:', command)
            rec = SocketUtils.requestSocket(command)
            # print('rec:', rec)
            data = CommandUtils.analyzeData(rec, command, mapping)
            data = data['user_log']
        else:
            # data = []
            data = shield_list
        cla = str(data.__class__)
        if not cla.startswith("<class 'list"):
            res = {'state': 'error', 'data': None}
        res = {'state': 'success', 'data': data}
        print('res:', res)
        return self.finish(res)
    get = post
class FaultRecordHandler(BaseHandler.BaseHandler):
    def get(self):
        res = {}
        with open(os.path.join(os.path.dirname(__file__), '../libs/24#20130901002714.txt')) as m:
            fault_state = m.readlines()
            print('type1:', type(fault_state))
            print('type2:', type(fault_state[0]))
            data = {}
            for i in range(len(fault_state)):
                data[(i + 1)] = fault_state[i].strip().split(',')
                print('type3:', type(fault_state))
                print('type4:', type(fault_state[i]))
            print('data:', data)
        # 信息发送完成后，返回一个成功的状态描述
        res['state'] = 'success'
        res['data'] = data
        print('res:', res)
        return self.finish(res)

