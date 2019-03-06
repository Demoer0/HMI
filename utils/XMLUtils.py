#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @File  : XMLUtils.py
# @Author: Zhang LianYue,Lin XiaoWen
# @DateTime  : 2017/12/8 15:41
# @Desc  : 操作文件的工具类，主要用于获取 xml 中的 address,返回address的list以及datamapping <=>address的映射dict

try:
    import xml.etree.cElementTree as ET
except ImportError:
    import xml.etree.ElementTree as ET
import collections
import os

# 构造xml文件地址
# xmlPath =os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static/HmiEntry-1010.xml')
xmlPath = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static/HmiEntry-181009.xml')
try:
    # "d://HmiEntry-1010.xml"
    tree = ET.parse(xmlPath)     # 打开xml文档
    root = tree.getroot()  # 获得root节点
    entry = root.iter('Entry')
    subentry = root.iter('Subentry')

    address1 = {}
    address2 = {}
    # dataType1 = {}
    # dataType2 = {}

    raw_address_list = {}
    # raw_dataType_list = {}
    for i in entry:
        # print(i.attrib)
        address1[i.get('name')] = i.get('Address')
        # dataType1[i.get('Address')] = i.get('dataType')

    raw_address_list.update(address1)
    # raw_dataType_list.update(dataType1)

    for i in subentry:
        address2[i.get('name')] = i.get('Address')
        # dataType2[i.get('Address')] = i.get('dataType')

    raw_address_list.update(address2)
    # raw_dataType_list.update(dataType2)

except Exception as e:
    print("analyze xml encountered error: " + e)
    # raw_address_list = dict(address1, **address2, **address3, **address4)


def get_addresses(*variable_names):
    # print('receiveAddr:', variable_names)
    # print(len(variable_names))
    if not variable_names:
        return []

    try:
        address_result = []
        address_mapping = collections.OrderedDict()
        # dataType_mapping = collections.OrderedDict()
        for each in variable_names:
            each_address = raw_address_list.get(each)
            # each_dataType = raw_dataType_list.get(each_address)
            if each_address:
                address_result.append(each_address)
                address_mapping[each] = each_address
                # dataType_mapping[each_address] = each_dataType
            else:
                address_result.append("")
                address_mapping[each] = ""
                # dataType_mapping[each_address] = ""
        # print("address_result: ", address_result)
        # print("matched mapping: ", mapping)
        return address_result, address_mapping
    except Exception as e:
        print("function get_addresses Error: " + e)


'''when developer need to test this py module, the function belowed can help.'''
# if __name__ == '__main__':
#     # variable_names = ["...the data points' names need to feild in here"]
#     variable_names = ["Pitch_com_state", "Pitch_com_quality", "Pitch_encode", "pit_set1", "pit_set2", "pit_set3",
#                          "angle1", "angle2", "angle3", "pit_speed1", "pit_speed2", "pit_speed3", "driver1_limit91",
#                          "driver2_limit91", "driver3_limit91", "driver1_limit95", "driver2_limit95", "driver3_limit95",
#                          "pit_Cur1", "pit_Cur2", "pit_Cur3", "pit_tem1", "pit_tem2", "pit_tem3", "driver1_overcurrent",
#                          "driver2_overcurrent", "driver3_overcurrent", "driver1_batt_voltage", "driver2_batt_voltage",
#                          "driver3_batt_voltage"]
#     address_result, address_mapping, dataType_mapping = get_addresses(*variable_names)
#     print("the address result is: ", address_result)
#     print(len(address_result))
#     print("the address mapping is: ", address_mapping)
#     print(len(address_mapping))
#     print("the datatype mapping is: ", dataType_mapping)
#     print(len(dataType_mapping))

