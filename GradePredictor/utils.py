import re
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression


def construct_model():
    df = pd.read_csv("Eindcijfer_voorspelling.csv", sep=';', skiprows=1, decimal=',')
    df = df.fillna(0)

    numeric_cols = [
        'quiz 1', 'quiz 2', 'quiz 3', 'quiz 4',
        'oefentoets 1', 'oefentoets 2',
        'deeltoets 1', 'deeltoets 2', 'deeltoets 3',
        'presentatie',
        'perusall 1 cijfer', 'perusall 2 cijfer', 'perusall 3 cijfer',
    ]

    df[numeric_cols] = df[numeric_cols].apply(pd.to_numeric)

    def format_reading_time(line: str) -> int:
        # if reading time is less than 60 minutes no hours are provided
        if ',' not in line:
            expression = r"([0-9]+) minute(?:s)"
            m = re.findall(expression, line)
            if len(m) != 1:
                return 0
            return int(m[0])

        # convert string to minutes
        expression = r"([0-9]+) hour(?:s)?, ([0-9]+) minute(?:s)"
        m = re.findall(expression, line)
        if len(m) != 1 or len(m[0]) != 2:
            return 0

        return (int(m[0][0]) * 60) + int(m[0][1])


    reading_time_cols = ['Active reading time', 'Active reading time.1', 'Active reading time.2']

    for col in reading_time_cols:
        df[col] = df[col].apply(lambda x: format_reading_time(x))

    train_cols = numeric_cols + ['Active reading time', 'Active reading time.1', 'Active reading time.2']

    X = np.array(df[train_cols])
    y = np.array(df['eindcijfer'])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)

    regr = LinearRegression()

    regr.fit(X_train, y_train)
    return regr, df


def get_expected_value(df: pd.DataFrame, key: str) -> float:
    return df[key].mean()


def construct_data(df, request):
    data = json.loads(request.data.decode('utf8').replace("'", '"'))
    data = { k: data[k] for k in data.keys() if data[k] is not None}

    quiz_1, quiz_1_exp = data.get("quiz_1"), get_expected_value(df, 'quiz 1')
    quiz_2, quiz_2_exp = data.get("quiz_2"), get_expected_value(df, 'quiz 2')
    quiz_3, quiz_3_exp = data.get("quiz_3"), get_expected_value(df, 'quiz 3')
    quiz_4, quiz_4_exp = data.get("quiz_4"), get_expected_value(df, 'quiz 4')

    practice_session_1, practice_session_1_exp = data.get("oefentoets_1"), get_expected_value(df, 'oefentoets 1')
    practice_session_2, practice_session_2_exp = data.get("oefentoets_2"), get_expected_value(df, 'oefentoets 2')

    exam_1, exam_1_exp = data.get("deeltoets_1"), get_expected_value(df, 'deeltoets 1')
    exam_2, exam_2_exp = data.get("deeltoets_2"), get_expected_value(df, 'deeltoets 2')
    exam_3, exam_3_exp = data.get("deeltoets_3"), get_expected_value(df, 'deeltoets 3')

    presentation, presentation_exp = data.get("presentation"), get_expected_value(df, 'presentatie')

    perusall_1, perusall_1_exp = data.get("perusall_1"), get_expected_value(df, 'perusall 1 cijfer')
    perusall_2, perusall_2_exp = data.get("perusall_2"), get_expected_value(df, 'perusall 2 cijfer')
    perusall_3, perusall_3_exp = data.get("perusall_3"), get_expected_value(df, 'perusall 3 cijfer')

    reading_time_1, rt_1_exp = data.get("reading_time_1"), get_expected_value(df, 'Active reading time')
    reading_time_2, rt_2_exp = data.get("reading_time_2"), get_expected_value(df, 'Active reading time.1')
    reading_time_3, rt_3_exp = data.get("reading_time_3"), get_expected_value(df, 'Active reading time.2')

    return {
        'quiz_1': {
            'value': quiz_1, 'expected_value': quiz_1_exp, 'is_expected': 'quiz_1' not in data.keys()
        },
        'quiz_2': {
            'value': quiz_2, 'expected_value': quiz_2_exp, 'is_expected': 'quiz_2' not in data.keys()
        },
        'quiz_3': {
            'value': quiz_3, 'expected_value': quiz_3_exp, 'is_expected': 'quiz_3' not in data.keys()
        },
        'quiz_4': {
            'value': quiz_4, 'expected_value': quiz_4_exp, 'is_expected': 'quiz_4' not in data.keys()
        },
        'practice_session_1': {
            'value': practice_session_1, 'expected_value': practice_session_1_exp, 'is_expected': 'oefentoets_1' not in data.keys()
        },
        'practice_session_2': {
            'value': practice_session_2, 'expected_value': practice_session_2_exp, 'is_expected': 'oefentoets_2' not in data.keys()
        },
        'exam_1': {
            'value': exam_1, 'expected_value': exam_1_exp, 'is_expected': 'deeltoets_1' not in data.keys()
        },
        'exam_2': {
            'value': exam_2, 'expected_value': exam_2_exp, 'is_expected': 'deeltoets_2' not in data.keys()
        },
        'exam_3': {
            'value': exam_3, 'expected_value': exam_3_exp, 'is_expected': 'deeltoets_3' not in data.keys()
        },
        'presentation': {
            'value': presentation, 'expected_value': presentation_exp, 'is_expected': 'presentation' not in data.keys()
        },
        'perusall_1': {
            'value': perusall_1, 'expected_value': perusall_1_exp, 'is_expected': 'perusall_1' not in data.keys()
        },
        'perusall_2': {
            'value': perusall_2, 'expected_value': perusall_2_exp, 'is_expected': 'perusall_2' not in data.keys()
        },
        'perusall_3': {
            'value': perusall_3, 'expected_value': perusall_3_exp, 'is_expected': 'perusall_3' not in data.keys()
        },
        'reading_time_1': {
            'value': reading_time_1, 'expected_value': rt_1_exp, 'is_expected': 'reading_time_1' not in data.keys()
        },
        'reading_time_2': {
            'value': reading_time_2, 'expected_value': rt_2_exp, 'is_expected': 'reading_time_2' not in data.keys()
        },
        'reading_time_3': {
            'value': reading_time_3, 'expected_value': rt_3_exp, 'is_expected': 'reading_time_3' not in data.keys()
        }
    }
