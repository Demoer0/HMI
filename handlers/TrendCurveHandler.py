# !/usr/bin/env python3
# coding: utf-8
import os

from handlers import BaseHandler
from utils import CommandUtils, SocketUtils


class TrendHandler(BaseHandler.BaseHandler):
    def get(self):
        pass

    def post(self):
        # print(self.request.arguments)
        # extract the command and points' name
        cm_from_front = self.get_argument("command", None)
        # print('cm_from_front:', cm_from_front)
        points_name = self.get_arguments("points_name[]")
        # print("points_name:", points_name)
        command, mapping = CommandUtils.constructCommand(cm_from_front, points_name)
        if not command:
            print("command has error")
            self.finish({"state": "error_command"})  # the command was error
        # request data
        rec = SocketUtils.requestSocket(command)
        # print('rec:', rec)
        if not rec:
            print("rec has error")
        # annalyze the data
        data = CommandUtils.analyzeData(rec, command, mapping)
        # print(data)
        if not data:
            print("data has error")
        # send the data to the front
        self.finish(data)

    get = post




class historyTrendHandler(BaseHandler.BaseHandler):
    def get(self):
        pass

    def post(self):
        # print(self.request.arguments)
        # extract the command and points' name
        cm_from_front = self.get_argument("command", None)
        # print('cm_from_front:', cm_from_front)
        points_name = self.get_arguments("points_name[]")
        # print("points_name:", points_name)
        command, mapping = CommandUtils.constructCommand(cm_from_front, points_name)
        if not command:
            print("command has error")
            self.finish({"state": "error_command"})  # the command was error
        # request data
        rec = SocketUtils.requestSocket(command)
        # print('rec:', rec)
        if not rec:
            print("rec has error")
        # annalyze the data
        data = CommandUtils.analyzeData(rec, command, mapping)
        # print(data)
        if not data:
            print("data has error")
        # send the data to the front
        self.finish(data)


    get = post



