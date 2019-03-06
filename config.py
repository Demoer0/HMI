#!/usr/bin/env python
# -*- coding: utf-8 -*-

# @File  : config.py
# @Author: Zhang LianYue
# @DateTime  : 2017/11/19 16:23
# @Desc  : 整个项目的配置文件

import os

# app 配置信息
settings = {
    "static_path": os.path.join(os.path.dirname(__file__), "static"),
    "template_path": os.path.join(os.path.dirname(__file__), "templates"),
    "debug": True,
    'cookie_secret': 'F8rRLoxLTMGmCBW4ol2bElwWFD1c3UiYvTTQdf/IN1k=',
    "login_url": '/testReport'
}

# 日志信息
log_level = "debug"
log_file = os.path.join(os.path.dirname(__file__), "logs/log.txt")

# 还可能有数据库、服务器等配置信息
