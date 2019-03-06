# 用户日志模块

from handlers import BaseHandler


class UserHandler(BaseHandler.BaseHandler):

    def get(self):
        print("userlog")
        res = {'state': 'success', 'data': [{'event': '用户1登陆', 'time': '20180111 15:46:32'},
                                            {'event': '用户1登陆', 'time': '20180111 15:46:32'}]}
        return self.finish(res)

        pass