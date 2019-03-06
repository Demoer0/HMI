# !/usr/bin/env python3
# coding: utf-8

from handlers import BaseHandler
from handlers import TestHandler

class historyTrendHandler(BaseHandler.BaseHandler):
    def get(self):
        pass

    def post(self):
        recordtime = self.get_argument("timeData")
        recordtime = int(recordtime)
        points_name = self.get_arguments("points_name[]")
        #recordtime=1
        num=recordtime*12
        # 建立一个数据字典
        data = {}
        # 如果点名为空
        if len(points_name) != 0:
            # 如果时间为0
            if recordtime != 0:
                # 传入新的记录字典，获取历史总的记录
                recorddic = TestHandler.recordDic
                # 获取历史总记录的长度
                for key in recorddic:
                    lenth = len(recorddic[key])
                # 判断前端传来的时间够不够当前存入历史总数据的个数
                if num <= lenth:
                    # 获取相关点名前N小时的数据
                    for key in points_name:
                        i = lenth - num
                        data[key] = recorddic[key][i:]
                    res = {'state': 'success', 'data': data}
                else:
                    res = {'state': 'error', 'data':None }
            else:
                res = {'state': 'error', 'data':None }
        else:
            res = {'state': 'error', 'data':None }
        
        return self.finish(res)

    get = post

