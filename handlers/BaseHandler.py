#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : BaseHandler.py
# @Author: Zhang LianYue
# @DateTime  : 2017/11/19 16:30
# @Desc  :handler基类，所有的 handler 均继承该类

import tornado.web


class BaseHandler(tornado.web.RequestHandler):
    """handler基类"""
    def prepare(self):
        pass

    def write_error(self, status_code, **kwargs):
        pass

    # 设置允许跨域请求
    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')

    def initialize(self):
        pass

    def on_finish(self):
        pass

    # 获取当前用户cookie名
    def get_current_user(self):
        return self.get_secure_cookie("name")
