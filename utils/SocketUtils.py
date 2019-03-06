#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : SocketUtils.py
# @Author: Lin XiaoWen
# @DateTime  : 2018/01/03
# @Desc  : socket工具类，用来向控制器发起请求

import socket

BUFSIZE = 2048
host = "localhost"
port = 6888

# 请求控制器方法，cmd为字节命令，websocket参数作为与websocket通信时的对象参数，默认为None，只有当websocket端调用时才输入
def requestSocket(cmd):
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.setsockopt(socket.SOL_SOCKET, socket.SO_KEEPALIVE, 1)
        s.connect((host, port))
        # print("socket connect success")

        # 发送指令
        # print('send: ', cmd)
        s.sendall(cmd)  # 不要用send()
        rec_data = s.recv(BUFSIZE)
        # print('receive:', rec_data)
        # for i in range(len(rec_data)):
        #    print(hex(rec_data[i]), end='  ')
        # print()
    except Exception as reason:
        print("出现异常的原因：", reason)
    finally:
        return rec_data  # 返回字节流
        pass
        s.close()
