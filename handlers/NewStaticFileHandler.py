#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : NewStaticFileHandler.py
# @Author: Lin XiaoWen
# @DateTime  : 2017/12/11 9:50
# @Desc  :用来展示静态页面，继承StaticFileHandler类，设置允许跨域请求

import tornado.web
import datetime
from tornado.web import StaticFileHandler


class NewStaticFileHandler(StaticFileHandler):
    # 设置允许跨域请求
    def set_default_headers(self):
        """为了子类给响应添加额外的头部"""
        # 新增允许跨域请求
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
