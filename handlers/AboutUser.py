#!/usr/bin/env python
from __future__ import unicode_literals
# -*- coding: utf-8 -*-
# @File  : AboutUserHandler.py
# @Author: Lin XiaoWen
# @DateTime  : 2017/12/12 11:00
# @Desc  : 关于用户所有接口合集，包括登录，新增用户，查询用户，删除用户，修改密码，记录和查询登录日志（仅作为测试用）

import logging
from logging.handlers import RotatingFileHandler
import os
import bcrypt
import json
from handlers import BaseHandler
import time

logger = logging.getLogger('log')
logger.setLevel(logging.INFO)
rhandler = RotatingFileHandler(os.path.join(os.path.dirname(__file__), '../logs/log.txt'),
                               maxBytes=1024,
                               backupCount=3,
                               encoding='utf-8')
rhandler.setLevel(logging.INFO)
logger.addHandler(rhandler)

# 用户登录,确认密码
class LoginHandler(BaseHandler.BaseHandler):

    def get(self):
        # 渲染模板
        self.render('login.html')

    def post(self):
        # flag作为标志符号标志是登录操作还是确认密码操作，默认为False，确认密码。
        flag = False
        global logger
        # 获取登录IP和日期
        login_ip = self.request.remote_ip
        date = time.strftime('%Y.%m.%d-%H:%M:%S', time.localtime(time.time()))

        # 判断是登录还是确认密码
        if self.get_secure_cookie('name') is None:  # 没有cookie，视为登录操作
            # 获取传过来的用户名和密码
            name = self.get_argument('name')
            flag = True
        else:
            name1 = self.get_argument('name', None)
            if name1 is None:
                name = self.current_user.decode()
            else:
                name = self.get_argument('name')
                res = {'state': 'error', 'describe': 'A user has been logged in.'}
                # return self.finish(res)
        pwd = self.get_argument('password')

        # 打开用户信息文件
        userFile = open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'libs/user.txt'), 'a+')
        # 先写入一条超级管理员账号密码以及权限等级（还有一个超级用户admin,密码权限同root）
        # firstUserName=r'root',firstUserPassword=r'123456',firstUserPermission=r'5'
        userFile.seek(0, 0)
        line1 = userFile.read().split('\n')
        userFile.close()
        res = {}
        for x in line1:
            if x == '':
                pass
            else:
                temp_name, temp_pwd, temp_pemi = x.split(',')
                if temp_name == name:
                    if bcrypt.checkpw(pwd.encode('utf-8'), temp_pwd.encode('utf-8')):
                        res = {'state': 'success', 'permission': temp_pemi}
                        # 当flag为True视为进行登录操作，且同时用户名密码匹配正确了再进行设置cookie
                        logger.info("%s,%s,%s,%s" % (login_ip, date, name,temp_pemi))
                        if flag is True:
                            # 设置当前用户cookie
                            self.set_secure_cookie('name', name, expires_days=None)
                            self.set_cookie('permission', temp_pemi, expires_days=None)
                        break
                    else:
                        res = {'state': 'error', 'describe': 'Incorrect username or password.'}
                        break
            if line1.index(x) == (line1.__len__() - 1):
                res = {'state': 'error', 'describe': 'Incorrect username or password.'}
        self.write(res)


# 新增用户
class AddUserHandler(BaseHandler.BaseHandler):
    def get(self):
        # 获取传过来的用户名、密码和权限等级
        name = self.get_argument('name')          # 用户名
        pwd = self.get_argument('password')       # 密码
        per = self.get_argument('permission')     # 权限等级

        print(name, pwd, per)

        # 对密码进行bcrypt加密并从bytes转换为str
        hashed = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt()).decode()
        print(hashed)

        # 打开用户信息文件
        userFile = open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'libs/user.txt'), 'a+')

        # 判断是否已存在该用户名
        userFile.seek(0, 0)
        lines = userFile.read().split('\n')
        for x in lines:
            if x == '':
                pass
            else:
                temp_name, temp_pwd, temp_pemi = x.split(',')
                if temp_name == name:
                    res = {'state': 'error', 'describe': 'The username has already existed!'}
                    break
            if lines.index(x) == (lines.__len__() - 1):
                # 将新增用户写入文件并关闭文件
                write = '%s,%s,%s\n' % (name, hashed, per)
                userFile.write(write)
                userFile.close()
                res = {'state': 'success'}
        return self.finish(res)
        pass

    def post(self, *args, **kwargs):
        pass
    post = get


# 查询用户
class QueryUserHandler(BaseHandler.BaseHandler):
    def get(self):
        # 获取传过来的权限等级并转为int格式
        per = int(self.get_argument('permission'))
        # 打开用户信息文件
        userFile = open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'libs/user.txt'), 'a+')
        # 判断权限等级并取出
        userFile.seek(0, 0)
        lines = userFile.read().split('\n')
        res = {}
        res['state'] = 'error'
        data = {}
        userFile.close()
        for x in lines:
            if x == '':
                pass
            else:
                temp_name, temp_pwd, temp_pemi = x.split(',')
                if per > int(temp_pemi):
                    res['state'] = 'success'
                    data[temp_name] = temp_pemi
            if lines.index(x) == (lines.__len__() - 1):
                # 循环到最后判断是否有获取到用户
                if res['state'] != 'success':
                    res['describe'] = 'The requested users do not exist.'
                else:
                    res['data'] = data
        return self.finish(res)
        pass

    def post(self, *args, **kwargs):
        pass
    post = get


# 删除指定用户
class DeleteUserHandler(BaseHandler.BaseHandler):
    def get(self):
        # 获取传过来的待删除的用户名
        name = self.get_argument('name')
        # 打开用户信息文件
        userFile = open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'libs/user.txt'), 'a+')
        userFile.seek(0, 0)
        lines = userFile.read().split('\n')
        # 清空文件所有内容
        userFile.truncate(0)
        # userFile.close()
        # userFile = open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'libs/user.txt'), 'r+')
        res = {}
        res['state'] = 'error'
        temp_data = ''
        # 找到该用户并不将其存入待写入区（将其删除）
        for x in lines:
            if x == '':
                pass
            else:
                temp_name, temp_pwd, temp_pemi = x.split(',')
                if name == temp_name:
                    res['state'] = 'success'
                else:
                    temp_data += '%s,%s,%s\n' % (temp_name, temp_pwd, temp_pemi)
            if lines.index(x) == (lines.__len__() - 1):
                # 循环到最后判断是否有匹配到待删除用户
                if res['state'] != 'success':
                    res['state'] = 'error'
                    res['describe'] = 'The user to be deleted does not exist.'
        userFile.write(temp_data)
        userFile.close()
        return self.finish(res)
        pass

    def post(self):
        pass

    post = get


# 修改密码(确认过原密码后)
class ChangePasswordHandler(BaseHandler.BaseHandler):
    def get(self):
        # 获取传过来的cookies中用户名以及旧密码和新密码
        name = self.current_user.decode()
        print(name)
        newPwd = self.get_argument('newPassword')  # string类型
        oldPwd = self.get_argument('oldPassword')
        hashed = bcrypt.hashpw(newPwd.encode('utf-8'), bcrypt.gensalt()).decode()
        # 打开用户信息文件
        userFile = open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'libs/user.txt'), 'a+')
        lines = userFile.read().split('\n')
        # 清空文件所有内容
        userFile.truncate(0)
        userFile.close()
        userFile = open(os.path.join(os.path.dirname(os.path.dirname(__file__)), 'libs/user.txt'), 'a+')
        res = {}
        res['state'] = 'error'
        temp_data = ''
        # 找到该用户并修改为新密码
        for x in lines:
            if x == '':
                pass
            else:
                temp_name, temp_pwd, temp_pemi = x.split(',')
                # print(temp_name.encode('utf-8'))
                if name == temp_name:
                    # 再一次确认旧密码是否正确，以防前端未作确认密码操作就进行修改密码请求
                    if bcrypt.checkpw(oldPwd.encode('utf-8'), temp_pwd.encode('utf-8')):
                        # 先判断新旧密码是否一致，一致则直接返回错误
                        if oldPwd == newPwd:
                            res = {'state': 'error', 'describe': 'The new password is the same as the old one.'}
                            temp_data += '%s,%s,%s\n' % (temp_name, temp_pwd, temp_pemi)
                            continue
                        res['state'] = 'success'
                        temp_data += '%s,%s,%s\n' % (temp_name, hashed, temp_pemi)
                    else:
                        res['state'] = 'error'
                        res['describe'] = 'The old password is wrong.'
                        temp_data += '%s,%s,%s\n' % (temp_name, temp_pwd, temp_pemi)
                else:
                    temp_data += '%s,%s,%s\n' % (temp_name, temp_pwd, temp_pemi)
            if lines.index(x) == (lines.__len__() - 1):
                # 循环到最后判断是否有匹配到用户
                if res['state'] != 'success':
                    res['state'] = 'error'
        userFile.write(temp_data)
        userFile.close()
        return self.finish(res)
        pass

    def post(self):
        pass
    post = get


# 登录查看
class LoginCheckHandler(BaseHandler.BaseHandler):
    def get(self):
        # 获取传过来的权限等级
        per = self.get_argument('permission', None)
        res = {}
        # 若获取不到cookie中的权限参数，则返回错误的信息
        if per is None:
            res['state'] = 'error'
            res['describe'] = 'you did not have permission'
        # 若获取到了，则读取登录信息的日志文件，将其中的记录发送给前端
        else:
            with open(os.path.join(os.path.dirname(__file__), '../logs/log.txt')) as f:
                login_log = f.readlines()
                data = {}
                for i in range(len(login_log)):
                    data[(i+1)] = login_log[i].strip().split(',')
                print('data:', data)
            # 信息发送完成后，返回一个成功的状态描述
            res['state'] = 'success'
            res['data'] = data
            print('res:', res)
        self.finish(res)

    def post(self):
        pass

    post = get
