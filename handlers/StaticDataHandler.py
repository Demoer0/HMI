#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : StaticDataHandle.py
# @Author: Lin XiaoWen
# @DateTime  : 2018/01/03
# @Desc  : 静态数据接口，处理刷新页面时才进行更新的数据请求


import json
from handlers import BaseHandler
from utils import CommandUtils
from utils import SocketUtils
from utils.XMLUtils import get_addresses
from utils.CSVReader import read_csv


class StaticDataHandler(BaseHandler.BaseHandler):
	def get(self):
		pass
	
	def post(self, *args, **kwargs):
		# print("init_data is: ", self.request.arguments)
		# init_data = self.request.arguments
		# print("type of init_data is:", type(init_data))
		cm = self.get_argument('command', default=None)
		point_name = self.get_argument('point_name', default=None)
		# print(point_name)
		point_value = self.get_argument('point_value', default=None)

		if cm == '21':
			data = {}
			data[point_name] = point_value
		else:
			data = point_name
		# print(data)
        # # 临时当前故障处理
        # if cm == '31':
        #     res = self.CurrentFault()
        #     return self.finish(res)
        #
        # # 临时历史故障处理
        # if cm == '41':
        #     res = self.HistoricalFault()
        #     return self.finish(res)
        #
        # # 临时风机日志处理
        # if cm == '51':
        #     res = self.HistoricalFault()
        #     return self.finish(res)
        #
        # # 临时用户日志处理
        # if cm == '61':
        #     res = self.HistoricalFault()
        #     return self.finish(res)

		command, mapping = CommandUtils.constructCommand(cm, data)
		#print('command:', command)
		if not command:
			print('command has error ')
			self.finish({'state': 'error_cmd'})  # 构造出的指令有误
		rec = SocketUtils.requestSocket(command)
		if not rec:
			print('rec has error ')
		data = CommandUtils.analyzeData(rec, command, mapping)
		if not data:
			print('data has error ')
		#print('retrunToClient:', str(data))
		self.finish(data)
	get = post

#    def CurrentFault(self):
#        str = ['B200_1', 'B200_14', 'Alarm_48', 'B200_12']
#        info = read_csv(str)
#        data = []
#        date = "2017-12-21 12:14:03"
#        for list in info:
#            temp = {}
#            temp["name"] = list
#            temp["occurtime"] = date
#            data.append(temp)
#        res = {'state': 'success', 'data': data}
#        return res

#    def HistoricalFault(self):
#        str = ['B200_1', 'B200_14', 'Alarm_48', 'B200_12']
#        info = read_csv(str)
#        data = []
#        occurTime = "2017-12-21 12:14:03"
#        endTime = "2017-12-21 12:15:15"
#        for list in info:
#            temp = {}
#            temp["name"] = list
#            temp["occurtime"] = occurTime
#            temp["endtime"] = endTime
#            data.append(temp)
#        res = {'state': 'success', 'data': data}
#        return res

#    def UserLog(self):
#        pass
