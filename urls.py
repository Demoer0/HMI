#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : urls.py
# @Author: Zhang LianYue
# @DateTime  : 2017/11/19 16:21
# @Desc  : 路由列表
from handlers import ReportHandler
from handlers import AboutUser
from handlers import NewStaticFileHandler
from handlers import WebSocketHandler
from handlers import StaticDataHandler
from handlers import TestHandler
from handlers import FaultHandler
from handlers import SystemWebSocketHandler
from handlers import TrendCurveHandler
from handlers import ParameterHandler
from handlers import HistoryTrendCurveHandler
import os

handlers = [
    # (r'/', Passport.IndexHandler),
    (r'/report', ReportHandler.ReportHandler),
    (r'^/report/(.*)$', NewStaticFileHandler.NewStaticFileHandler,
     {"path": os.path.join(os.path.dirname(__file__), "static/front_end_pages"),
      "default_filename": "login.html"}),
    (r'/login', AboutUser.LoginHandler),
    (r'/addUser', AboutUser.AddUserHandler),
    (r'/queryUser', AboutUser.QueryUserHandler),
    (r'/deleteUser', AboutUser.DeleteUserHandler),
    (r'/changPassword', AboutUser.ChangePasswordHandler),
    (r'/webSocket', WebSocketHandler.WebSocketHandler),
    (r'/staticData', StaticDataHandler.StaticDataHandler),
    (r'^/main/(.*)$', NewStaticFileHandler.NewStaticFileHandler,
     {"path": os.path.join(os.path.dirname(__file__), "static/front_end_pages"),
      "default_filename": "main.html"}),
    (r'/test2', TestHandler.websocketHandler),
    (r'/currentFaultHandler', FaultHandler.CurrentFaultHandler),
    (r'/historicalFaultHandler', FaultHandler.HistoricalFaultHandler),
    (r'/userLogHandler', FaultHandler.UserLogHandler),
    (r'/fanLogHandler', FaultHandler.FanLogHandler),
    (r'/faultListHandler', FaultHandler.FaultListHandler),
    (r'/faultRestHandler', FaultHandler.FaultRestHandler),
    (r'/faultShieldHandler', FaultHandler.FaultShieldHandler),
    (r'/logincheck', AboutUser.LoginCheckHandler),
    (r'/systemws', SystemWebSocketHandler.PushDataHandler),
    (r'/trendcurve', TrendCurveHandler.TrendHandler),
    (r'/recordtrendcurve', HistoryTrendCurveHandler.historyTrendHandler),
    (r'/faultrecord', FaultHandler.FaultRecordHandler),
    (r'/changeparameter', ParameterHandler.ParamterModifyHandler),
    (r'/queryparameter', ParameterHandler.ParamterQueryHandler),
    (r'^/queryparameter/(.*)$', NewStaticFileHandler.NewStaticFileHandler,
     {"path": os.path.join(os.path.dirname(__file__), "static/front_end_pages"),
      "default_filename": "login.html"})
    # 使用 tornado 提供的静态文件处理类来处理 html，path 指定静态文件的根目录
    # (r'/(.*)', tornado.web.StaticFileHandler, dict(path=os.path.join(os.path.dirname(__file__), "html"))),
]
