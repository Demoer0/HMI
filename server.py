#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : server.py
# @Author: Zhang
# @DateTime  : 2017/11/19 16:10
# @Desc  : 主要的程序入口

import tornado.web
import tornado.ioloop
import tornado.httpserver
import tornado.netutil
import tornado.process
import tornado.options
from urls import handlers
from handlers import TestHandler
import config as config
import threading

tornado.options.define("port", type=int, default=8888, help="run server on the port")


class MyApplication(tornado.web.Application):
    def __init__(self, *args, **kwargs):
        super(MyApplication, self).__init__(*args, **kwargs)


if __name__ == "__main__":

    tornado.options.parse_command_line()
    app = MyApplication(handlers, **config.settings)
    http_server = tornado.httpserver.HTTPServer(app)
    sockets = tornado.netutil.bind_sockets(tornado.options.options.port)
    tornado.process.fork_processes(0)
    http_server.add_sockets(sockets)
    # http_server.listen(tornado.options.options.port)

    # threading.Thread(target=TestHandler.sendMessage).start()
    t1 = TestHandler.historyRecordHandler()
    t2 = TestHandler.messageHandler()
    try:
        # 开启推送线程
        t1.start()
        t2.start()
        # 开启程序的线程
        tornado.ioloop.IOLoop.current().start()
    except KeyboardInterrupt as e:
        print("the error is: ", e)
        t1.join()
        t2.join()
