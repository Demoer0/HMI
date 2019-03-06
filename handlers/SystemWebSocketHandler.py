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
import os
import random
import datetime
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


class PushDataHandler(WebSocketHandler):
	users = set()  # 用来存放连接用户的容器
	# command_container = {}     # store the command of the users
	# mapping_container = {}
	
	@tornado.gen.coroutine
	def open(self):
		yield self.users.add(self)  # 建立连接后添加用户到容器中
		print("%s connect sucess." % (self.request.remote_ip))
		# self.write_message("Hello cient")

	@tornado.gen.coroutine
	def on_message(self, message):
		# 收到请求数据的指令，存入req，并回复给该用户，目前每隔三秒回复一次
		try:
			# if message == '1':
			# 	for user in self.users:
			# 		command = self.command_container[user]
			# 		mapping = self.mapping_container[user]
			# 		yield self.send_msg(command, mapping, user)
			# else:
			# 	for user in self.users:
			# 		msg = json.loads(message)
			# 		# print("the message from front is: ", msg)
			# 		cm_from_website = msg['command']
			# 		points_name = msg['data']
			# 		command, mapping = CommandUtils.constructCommand(cm_from_website, points_name)
			# 		# print("the command to the main controller is: %s" % command)
			# 		self.command_container[user] = command
			# 		self.mapping_container[user] = mapping
			# 		yield self.send_msg(command, mapping, user)
			# for user in self.users:
			# 	if message == '1':
			# 		command = self.command_container[user]
			# 		mapping = self.mapping_container
			# 		yield user.send_msg(command, mapping, user)
			# 	else:
			# 		msg = json.loads(message)
			# 		cm_from_website = msg['command']
			# 		points_name = msg['data']
			# 		command, mapping = CommandUtils.constructCommand(cm_from_website, points_name)
			# 		self.command_container[user] = command
			# 		self.mapping_container = mapping
			# 		yield user.send_msg(command, mapping, user)
			# print("the message from front is: %s" % message)
			yield self.send_msg(message)
		except Exception as e:
			print("a user has removed.")
		
	def on_close(self):
		self.users.remove(self)  # 用户关闭连接后从容器中移除用户
		# self.command_container.pop(self)
		# self.mapping_container.pop(self)
		print('%s connect breaked.' % self.request.remote_ip)
		
	def check_origin(self, origin):
		return True  # 允许WebSocket的跨域请求
	
	def send_msg(self, message):
		try:
			# process the message from the front page
			msg = json.loads(message)
			cm_from_website = msg['command']
			points_name = msg['data']
			# construct the command through the message
			command, mapping = CommandUtils.constructCommand(cm_from_website, points_name)
			# request data from the main controller service
			rec = SocketUtils.requestSocket(command)
			data = CommandUtils.analyzeData(rec, command, mapping)
			# print("the data to the front is: %s" % data)
			# send the data to the front page
			self.write_message(data)
			time.sleep(1)
		except tornado.websocket.WebSocketClosedError as e:
			logging.info(e)
