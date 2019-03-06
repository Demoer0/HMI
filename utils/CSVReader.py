import csv
import os


def read_csv(statuscode):
    res = []
    for code in statuscode:
        info = ''
        csv_reader = csv.reader(open(os.path.join(os.path.dirname(os.path.dirname(__file__)),
                                                  'libs/statuscode.csv'), 'r'))
        for row in csv_reader:
            if row[1] == code:
                info = row[2]
                res.append(info)
                break
        if info == '':
            res.append("statuscode not found")
    return res
