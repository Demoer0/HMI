#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  :ParameterHandler.py
# @Author: Fu Qi
# @DateTime  : 2018/09/15
# @Desc  : process the reuqest of the parameter moudle

import logging
import os
from logging.handlers import RotatingFileHandler
from handlers import BaseHandler
from utils import CommandUtils
from utils import SocketUtils
import time

logger = logging.getLogger('mlog')
logger.setLevel(logging.INFO)
mhandler = RotatingFileHandler(os.path.join(os.path.dirname(__file__), '../logs/modifylog.txt'),
                               maxBytes=1024,
                               backupCount=3,
                               encoding='utf-8')
mhandler.setLevel(logging.INFO)
logger.addHandler(mhandler)


class ParamterModifyHandler(BaseHandler.BaseHandler):
    def get(self):
        pass

    def post(self):
        # print(self.request.arguments)
        global logger
        date = time.strftime('%Y.%m.%d-%H:%M:%S', time.localtime(time.time()))
        cm_from_front = self.get_argument("command", default=None)
        point_name = self.get_argument("point_name", default=None)
        point_value = self.get_argument('point_value', default=None)
        dat = ""
        login_cm = "scan"
        logger.info("%s,%s" % (dat, login_cm))
        #  print(cm_from_front + '+' + point_name + '+' + point_value)
        if cm_from_front == '21':
            data_from_front = dict()
            data_from_front[point_name] = point_value
            login_cm = "Paramtermodify"
            logger.info("%s,%s" % (date, login_cm))
        else:

            data_from_front = point_name
        # print(data_from_front)
        command, mapping = CommandUtils.constructCommand(cm_from_front, data_from_front)
        # print('command:', command)
        if not command:
            print('command has error ')
            self.finish({'state': 'error_cmd'})  # 构造出的指令有误
        rec = SocketUtils.requestSocket(command)
        if not rec:
            print('rec has error ')
        data_to_front = CommandUtils.analyzeData(rec, command, mapping)
        if not data_to_front:
            print('data has error ')
        # print('retrunToClient:', str(data_to_front))

        self.finish(data_to_front)

    get = post


class ParamterQueryHandler(BaseHandler.BaseHandler):
    def get(self):
        pass

    def post(self):
        # print(self.request.arguments)
        cm_from_front = self.get_argument("command", default=None)
        points_name = self.get_arguments("points_name[]")
        point_value = self.get_argument('point_value', default=None)
        # print(cm_from_front + '+' + point_name + '+' + point_value)
        print("command1: ", cm_from_front)
        print("mapping1: ", points_name)
        if cm_from_front == '21':
            data_from_front = dict()
            data_from_front[points_name] = point_value
        else:
            data_from_front = points_name
        # print(data_from_front)
        command, mapping = CommandUtils.constructCommand(cm_from_front, data_from_front)
        print("command: ", command)
        print("mapping: ", mapping)
        # print('command:', command)
        if not command:
            print('command has error ')
            self.finish({'state': 'error_cmd'})  # 构造出的指令有误
        rec = SocketUtils.requestSocket(command)
        print('the data from main controlers: ', rec)
        if not rec:
            print('rec has error ')
        data_to_front = CommandUtils.analyzeData(rec, command, mapping)
        print("the data send to website is: ", data_to_front)
        if not data_to_front:
            print('data has error ')
        # print('retrunToClient:', str(data_to_front))
        self.finish(data_to_front)

    get = post
