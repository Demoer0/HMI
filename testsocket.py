# !/usr/bin/env python
# coding: utf-8


from utils import CommandUtils
from utils import SocketUtils

if __name__ == "__main__":
    # cm_from_website = '21'
    # data_from_website = {'conect_G_RSpd': '1500'}
    cm_from_website = '11'
    # data_from_website = ['angle1']
    data_from_website = ['Fault_sum', 'Fault_NO1', 'Fault_act_time1']
    # data_from_website = ["Pitch_com_state", "Pitch_com_quality", "Pitch_encode", "pit_set1", "pit_set2", "pit_set3", "angle1", "angle2", "angle3", "pit_speed1", "pit_speed2", "pit_speed3", "driver1_limit91", "driver2_limit91", "driver3_limit91", "driver1_limit95", "driver2_limit95", "driver3_limit95", "pit_Cur1", "pit_Cur2", "pit_Cur3", "pit_tem1", "pit_tem2", "pit_tem3", "driver1_overcurrent", "driver2_overcurrent", "driver3_overcurrent", "driver1_batt_voltage", "driver2_batt_voltage", "driver3_batt_voltage"]
    # cm_from_website = '61'
    # data_from_website = None
    command, address_mapping = CommandUtils.constructCommand(cm_from_website, data_from_website)
    print("command: ", command)
    print("mapping: ", address_mapping)
    rec = SocketUtils.requestSocket(command)
    print('the data from main controlers: ', rec)
    data = CommandUtils.analyzeData(rec, command, address_mapping)
    print("the data send to website is: ", data)
    #print(data['current_fault'].__class__)
