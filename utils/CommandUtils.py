#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : CommandUtils.py
# @Author: Lin XiaoWen
# @DateTime  : 2018/01/03
# @Desc  : 命令处理工具类，用来存放命令转换以及数据解析的方法

import random
import struct
import collections
import time

from utils import SocketUtils
from utils import XMLUtils


# 判断指令类型，并根据指令类型构造命令
def constructCommand(cmd, data):
    # 判断指令
    # turn_data = json.loads(data)
    # print('data:%s' % str(data))
    # print('dataType:%s' % type(data))
    if cmd == "11":  # 读数据指令
        # 将datamapping转化为地址,get_addresses返回地址list和datamapping <=>address的映射dict
        address, address_mapping = XMLUtils.get_addresses(*data)
        command = strToCommand(address, cmd)  # 地址转化为指令
    elif cmd == '21':  # 写入数据指令
        address, address_mapping = XMLUtils.get_addresses(*data)
        # 构造address<=>数据的dict
        addr = {}
        for key in address_mapping.keys():
            addr[address_mapping[key]] = data[key]
        # print(addr)
        command = strToCommand(addr, cmd)
    elif cmd == '31':
        command = b'\x31'
        address_mapping = None
    elif cmd == '41':
        command = b'\x41'
        address_mapping = None
    elif cmd == '51':
        command = b'\x51'
        address_mapping = None
    elif cmd == '61':
        command = b'\x61'
        address_mapping = None
    elif cmd == '71':
        command = strToPoint(cmd, data)
        address_mapping = None
    else:
        command = None
        address_mapping = None
    return command, address_mapping


def strToPoint(cmd, data):
    command = bytearray()
    # 添加指令
    command += bytes.fromhex(cmd)
    # print(command)
    # 添加包号，包号在0x00-0xFF之间，占一个字节，用B，‘<’为小端存储
    num = random.randint(0x00, 0xFF)
    command += struct.pack('<B', num)
    # 添加数据个数（长度），占四个字节，用i;
    # 获取数据长度
    length = len(data)
    # 每8个为1个数据
    leng = length // 8
    # print('length:', leng)
    command += struct.pack('<i', leng)
    k = 0
    flag = 0
    temp_data = command
    while k < leng:
        # 前端来的数据，每8个一组
        temp_array = data[flag:flag + 8]
        # print('temp_array', temp_array)
        # 数组反转
        temp_array.reverse()
        # 字符数组转化为字符串
        temp_array = ''.join(temp_array)
        # print('temp_array1：', temp_array)
        # temp_array= (temp_array).encode('utf-8')
        # 二进制字符串转化为十六进制数
        temp_array = bytes([int(temp_array, 2)])
        # 将循环的十六进制数连接起来
        temp_data += temp_array
        # print('temp_array：', temp_array)
        # 前端传来的数据位数加8
        flag = flag + 8
        # print('flag', flag)
        # 循环加一
        k = k + 1
    return command


# 将地址列表以及命令指令转化成控制器接受的命令语句
# 读数据指令的addrList是地址列表，写数据指令的addrList是dict，key是地址，value是待写入的数据；
def strToCommand(addrList, cmd):
    command = bytearray()
    # 添加指令
    command += bytes.fromhex(cmd)
    # 添加包号，包号在0x00-0xFF之间，占一个字节，用B，‘<’为小端存储
    num = random.randint(0x00, 0xFF)
    command += struct.pack('<B', num)

    # 添加数据个数（长度），占两个字节，用H;
    length = len(addrList)
    command += struct.pack('<H', length)

    for x in addrList:
        if (x[:2] == '0x') and (len(x) == 10):
            # 去掉各个地址最前端的0x,将各个地址转换为字节
            b = bytes.fromhex(x[2:])
            # 将字节数组倒序取出并放入新的字节数组
            command += b[::-1]
            # 判断是否为写入数据指令，若是则增加处理待写入数据的步骤
            if cmd == '21':
                dataType = b[0] & 0x0f
                # dataType = datatypemap[x]
                res = matchDataType(dataType)
                value = changeDataType(dataType, addrList[x])
                data = struct.pack(res['string'], value)
                print("the data command is: ", data)
                command += data
    return command


# 解析返回数据，参数rec是控制器返回的字节流，cmd是发送给控制器的命令，map是datamapping和地址的映射
# 最后返回字典，key是datamapping，value是数据
def analyzeData(rec, cmd, address_mapping):
    result = collections.OrderedDict()
    # 判断参数类型
    # 判断指令类型
    cla = str(cmd.__class__)
    if not cla.startswith("<class 'byte"):
        print(cla)
        result['state'] = 'error_Type_command'  # 参数类型错误
        return result
    # 判断返回数据的类型
    cla = str(rec.__class__)
    if not cla.startswith("<class 'byte"):
        print(cla)
        result['state'] = 'error_Type_data'  # 参数类型错误
        return result
    # 判断address_mapping的类型
    cla = str(address_mapping.__class__)
    if cla != "<class 'NoneType'>":
        if cla != "<class 'collections.OrderedDict'>":
            print(cla)
            result['state'] = 'error_Type'  # 参数类型错误
            return result
    # 匹配指令以及对应数据解析
    # 字节数组cmd[0]这种方式取单个字节出来自动变成int，使用cmd[0:1]取单个字节出来则还是字节格式
    # 处理11指令返回的的数据
    if cmd[0:1] == b'\x11':
        if rec[0:1] == b'\x12':
            if rec[1:2] == cmd[1:2]:
                result = handle_11(rec, address_mapping)
            else:
                result['state'] = 'error_00'  # 包号不匹配
        else:
            result['state'] = 'error_01'  # 返回数据指令不正确
    # 处理21指令返回的数据
    elif cmd[0:1] == b'\x21':
        if rec[0:1] == b'\x22':
            if rec[1:2] == cmd[1:2]:
                result = handle_21(rec, address_mapping)
            else:
                result['state'] = 'error_00'  # 包号不匹配
        else:
            result['state'] = 'error_01'  # 返回数据指令不正确
    # 处理当前故障指令返回的数据
    elif cmd[0:1] == b'\x31':
        if rec[0:1] == b'\x32':
            result['current_fault'] = handle_31(rec)
        else:
            result['state'] = 'error_01'
    # 处理历史故障指令的返回数据
    elif cmd[0:1] == b'\x41':
        if rec[0:1] == b'\x42':
            result['history_fault'] = handle_41(rec)
        else:
            result['state'] = 'error_01'
    # 处理风机日志指令的返回数据
    elif cmd[0:1] == b'\x51':
        if rec[0:1] == b'\x52':
            result['machine_log'] = handle_51(rec)
        else:
            result['state'] = 'error_01'
    # 处理用户日志指令的返回数据
    elif cmd == b'\x61':
        if rec[0:1] == b'\x62':
            result['user_log'] = handle_61(rec)
        else:
            result['state'] = 'error_01'
    elif cmd[0:1] == b'\x71':
        if rec[0:1] == b'\x72':
            result['user_log'] = handle_61(rec)
        else:
            result['state'] = 'error_01'
    else:
        result['state'] = 'error_01'
    return result


# 处理读取指令返回的数据
def handle_returned_data(datatype, origindata):
    tempdata = struct.unpack(datatype['string'], origindata)
    if tempdata[0] == True:
        return (1,)
    elif tempdata[0] == False:
        return (0,)
    else:
        return tempdata
# 向主控请求数据并返回
def sendHistoryMessage():
    command = '11'  # 取出对应指令
    data_from_website = ["ave_Onesec_Wsp",  "ave_Halfmin_Wsp", "ave_Tenmin_Wsp", "Rotor_RSpd", "Gear_RSpd", "G_RSpd1"]
    command, address_mapping = constructCommand(command, data_from_website)
    rec = SocketUtils.requestSocket(command)  # 请求数据
    controlerData = analyzeData(rec, command, address_mapping)  # 解析数据
    data = controlerData['data']
    return data
# 记录历史趋势数据
def recordTimeData(timeData, recorddatas, recordDic):

    for key in recorddatas:
        value = recorddatas[key]
        recordDic[key].append({timeData: value})
    print(recordDic)
    return recordDic


# 处理读数据指令
def handle_11(rec, address_mapping):
    res = {}  # 待返回的数据结果
    res['data'] = collections.OrderedDict()

    # 判断是否故障码
    state = matchErrorCode(rec[2:3])
    res['state'] = state
    if state != 'success':
        return res

    # 读取数据个数
    length = struct.unpack('<H', rec[2:4])[0]
    k = 0  # 循环标志位
    flag = 4  # 读取字节数据标志位，从第四位开始为数据地址
    temp = collections.OrderedDict()
    while k < length:
        # 取地址,标志位移动
        a = rec[flag:flag + 4]
        flag += 4
        addr = a[::-1]
        # 取数据类型位，地址的第一个字节中的低位，最后结果为整型
        dataType = addr[0] & 0x0f
        # dataType = handle_returned_address(addr, datatype_mapping)
        # 匹配数据类型以及占字节数，得到解码的类型符号（struct包对应）
        res_dict = matchDataType(dataType)
        # 取出对应数据位字节,转为对应数据类型，并移动标志位
        data_b = rec[flag:flag + res_dict['bytesNum']]
        data = struct.unpack(res_dict['string'], data_b)  # tuple元组类型
        # data = handle_returned_data(res_dict, data_b)
        flag += res_dict['bytesNum']
        # print("type of data is: ", type(data[0]))
        # print('data is:', data[0])
        # 将地址（字节正序）与数据匹配存储
        if str(data[0].__class__) == "<class 'float'>":
            temp[addr] = round(data[0], 2)
        else:
            temp[addr] = data[0]
        # temp[addr] = data[0]
        k = k + 1
    # 匹配datamapping<=>addr<=>data,最后形成datamapping<=>data的字典，并返回
    # mapping={"STATS.2.running_state":"0x1600013F",...}
    for key in address_mapping.keys():
        # 对字符地址做处理，去掉0x转为字节正序
        temp_ad = address_mapping[key]
        temp_addr = bytes.fromhex(temp_ad[2:])
        # 匹配地址
        try:
            res['data'][key] = temp[temp_addr]
        except Exception as e:
            print('cannot match the right address')
            print(e)
    return res


# 处理写数据指令
def handle_21(rec, address_mapping):
    res = {}  # 待返回的数据结果
    res['data'] = collections.OrderedDict()
    # 判断是否故障码
    state = matchErrorCode(rec[2:3])
    res['state'] = state
    if state != 'success':
        return res

    # 读取数据个数
    length = struct.unpack('<H', rec[2:4])[0]
    k = 0  # 循环标志位
    flag = 4  # 读取字节数据标志位，从第四位开始为数据地址
    addr = []
    while k < length:
        # 取地址,标志位移动
        a = rec[flag:flag + 4]
        flag += 4
        addr.append(a[::-1])
        k = k + 1
    # 匹配写入数据成功的datamapping<=>addr,最后形成datamapping<=>success/fail的字典，并返回
    # mapping={"STATS.2.running_state":"0x1600013F",...}
    for key in address_mapping.keys():
        # 对字符地址做处理，去掉0x转为字节正序
        temp_ad = address_mapping[key]
        temp_addr = bytes.fromhex(temp_ad[2:])
        # 匹配地址,设置原始的所有数据写入状态均为失败，匹配到成功时才设置为成功
        res['data'][key] = 'fail'
        for a in addr:
            if a == temp_addr:  # 匹配到该地址数据写入成功
                res['data'][key] = 'success'
    return res


# 处理当前故障指令的返回数据
def handle_31(rec):
    # 解析出故障数据的个数
    length = struct.unpack('<H', rec[2:4])[0]
    # print('length:', length)
    if length == 0:
        return "there is no current fault"
    # 解析出每个故障数据并存入一个字典中
    # 单个故障数据的组成：序号(32位整型)+发生时间(32位整型)
    k = 0  # 循环标志位
    flag = 6  # 读取字节数据标志位，第4位开始为故障数据
    fault_data = []
    while k < length:
        fault = []
        # 读取出日志序号
        serial_number = struct.unpack('<I', rec[flag: flag + 4])[0]
        # print('serial_number:', serial_number)
        fault.append(serial_number)
        flag += 4
        # 读取日志时间
        occur_time = struct.unpack('<I', rec[flag: flag + 4])[0]
        # print('occur_time:', occur_time)
        # timeStamp = occur_time
        timeArray = time.localtime(occur_time)
        occur_time = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
        # print(occur_time)    # 1997--05--20 09:36:00
        # print('occur_time:', occur_time)
        fault.append(occur_time)
        flag += 4
        # print('flag:',flag)
        fault_data.append(fault)
        k += 1
    # print('k:', k)
    return fault_data


# 处理历史故障指令的返回数据
def handle_41(rec):
    # 读取出故障数据的个数
    length = struct.unpack('<H', rec[2:4])[0]
    if length == 0:
        return "there is no history fault"
    # 读取出每个故障数据
    # 其组成为：序号(32位整型)+发生时间(32位整型)+复位时间(32位整型)+发生次数(32位整型)
    k = 0  # 循环标志位
    flag = 6  # 字节数据标志位，实际的数据型从第4位开始
    fault_data = []  # 存储所有历史故障数据的变量
    while k < length:
        temp_data = []  # 存储单个历史故障数据的变量
        # 解析出单个历史故障数据的序号
        serial_number = struct.unpack('<I', rec[flag: flag + 4])[0]
        temp_data.append(serial_number)
        flag += 4
        # 解析出单个历史故障数据的发生时间
        occur_time = struct.unpack('<I', rec[flag: flag + 4])[0]
        timeArray = time.localtime(occur_time)
        occur_time = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
        temp_data.append(occur_time)
        flag += 4
        # 解析出单个历史故障数据的复位时间
        rest_time = struct.unpack('<I', rec[flag: flag + 4])[0]
        timeArray = time.localtime(rest_time)
        rest_time = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
        temp_data.append(rest_time)
        flag += 4
        '''
        解析出单个历史故障数据的发生次数
        times = struct.unpack('<I', rec[flag: flag+4])[0]
        temp_data.append(times)
        flag += 4
        '''
        fault_data.append(temp_data)
        k += 1
    return fault_data


# 处理风机日志指令的返回数据
def handle_51(rec):
    # 解析出风机日志的数据个数
    length = struct.unpack('<H', rec[2:4])[0]
    if length == 0:
        return "there is no machine log"
    # 解析出单个风机日志数据
    # 数据组成：日志序号(32位整型) + 发生时间(32位整型)
    k = 0
    flag = 6
    machine_log = []
    while k < length:
        temp_data = []
        # 解析出单个风机日志的序号
        serial_number = struct.unpack('<I', rec[flag: flag + 4])[0]
        temp_data.append(serial_number)
        flag += 4
        # 解析出单个风机日志的发生时间
        occur_time = struct.unpack('<I', rec[flag: flag + 4])[0]
        timeArray = time.localtime(occur_time)
        occur_time = time.strftime("%Y-%m-%d %H:%M:%S", timeArray)
        temp_data.append(occur_time)
        flag += 4

        machine_log.append(temp_data)
        k += 1
    return machine_log


# 处理故障列表指令的返回数据
def handle_61(rec):
    length = struct.unpack('<H', rec[2:4])[0]
    # print('length:', length)
    if length == 0:
        return "there is no user log"
    # 解析单个用户日志数据
    k = 0
    flag = 6
    fault_list = []
    temp_data = []
    while k < length:
        temp_array = []
        # 解析出单个数据两位十六进制转为十进制int型
        onedata = struct.unpack('<B', rec[flag: flag + 1])[0]
        # 十进制int型转为ob+8位二进制字符
        onedata = bin(onedata)
        # 转为列表数组
        for c in onedata:
            temp_array.append(c)
        # 在数组里去掉开头的ob两个字符
        temp_array = temp_array[2:]
        # 数组倒序排放
        temp_array.reverse()
        leng = len(temp_array)
        # 数组不足8位的补全8位
        while leng < 8:
            temp_array.append('0')
            leng = leng + 1
        # 将数组添加入临时数组
        temp_data.extend(temp_array)
        # print('t:', t)
        # print('flag:',flag)
        flag += 1
        k += 1
    fault_list.extend(temp_data)
    print('user_log', fault_list)
    return fault_list


# 匹配数据类型，返回struct处理的字符以及占字节数
def matchDataType(dataType):
    # 数据均为小端存储，事先添加小端符号<
    string = '<'
    bytesNum = 0
    if dataType == 1:
        # bool类型，对应struct包为‘？’，占1个字节
        string += '?'
        bytesNum = 1
    elif dataType == 2:
        # 8位有符号整型，对应struct包为‘b’，占1个字节
        string += 'b'
        bytesNum = 1
    elif dataType == 3:
        # 16位有符号整型，对应struct包为‘h’，占2个字节
        string += 'h'
        bytesNum = 2
    elif dataType == 4:
        # 32位有符号整型，对应struct包为‘i’，占4个字节;还有个'l',C中为long型，暂时用‘i’;
        string += 'i'
        bytesNum = 4
    elif dataType == 5:
        # 64位有符号整型，对应struct包为‘q’，占8个字节
        string += 'q'
        bytesNum = 8
    elif dataType == 6:
        # 8位无符号整型，对应struct包为‘B’，占1个字节
        string += 'B'
        bytesNum = 1
    elif dataType == 7:
        # 16位无符号整型，对应struct包为‘H’，占2个字节
        string += 'H'
        bytesNum = 2
    elif dataType == 8:
        # 32位无符号整型，对应struct包为‘I’，占4个字节;还有个'L',C中为long型，暂时用‘I’;
        string += 'I'
        bytesNum = 4
    elif dataType == 9:
        # 64位无符号整型，对应struct包为‘Q’，占8个字节
        string += 'Q'
        bytesNum = 8
    elif dataType == 10:
        # 32位浮点型，对应struct包为‘f’，占4个字节
        string += 'f'
        bytesNum = 4
    elif dataType == 11:
        # 64位浮点型，对应struct包为‘d’，占8个字节
        string += 'd'
        bytesNum = 8
    res = {
        'string': string,
        'bytesNum': bytesNum
    }
    return res


# change the point_value to the original type
def changeDataType(dataType, data):
    if dataType == 1:
        if data == 'true':
            return True
        elif data == 'false':
            return False
        else:
            return eval(data)
    else:
        return eval(data)


# 匹配是否为错误码，只适用于读写数据指令（0x12、0x22）,其他指令只需判断一次不用进入本方法
def matchErrorCode(code):
    # 判断是否故障码
    if code == b'\xff':
        res = 'error_ff'  # 控制器接收到的指令错误
    elif code == b'\xfe':
        res = 'error_fe'  # 预读取个数超限
    elif code == b'\xfd':
        res = 'error_fd'  # 地址超限
    elif code == b'\xfc':
        res = 'error_fc'  # 数据类型错误
    elif code == b'\xfb':
        res = 'error_fb'  # 位地址超限
    elif code == b'\xfa':
        res = 'error_fa'  # 偏移地址超限
    elif code == b'\xf0':
        res = 'error_f0'  # 写入失败
    else:
        res = 'success'
    return res
