#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : ReportHandler.py
# @Author: Zhang LianYue
# @DateTime  : 2017/11/19 20:42
# @Desc  : 报表接口（仅作为测试用）


from handlers import BaseHandler
from utils import CommandUtils, SocketUtils

class ReportHandler(BaseHandler.BaseHandler):
	def post(self):
		# print(self.request.arguments)
		# extract the command and points' name
		cm_from_front = self.get_argument("command", None)
		points_name = self.get_arguments("points_name[]")
		print(cm_from_front, points_name)
		command, mapping = CommandUtils.constructCommand(cm_from_front, points_name)
		print(command)
		if not command:
			print("command has error")
			self.finish({"state": "error_command"})       # the command was error
		# request data
		rec = SocketUtils.requestSocket(command)
		print('rec:', rec)
		if not rec:
			print("rec has error")
		# annalyze the data
		data = CommandUtils.analyzeData(rec, command, mapping)
		print(data)
		if not data:
			print("data has error")
		# send the data to the front
		self.finish(data)
