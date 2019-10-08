import {SET_REPORT_YEAR, SET_REPORT_MONTH } from '../types';

export const setReportYear = (year) => {
  return (dispatch) => {
    dispatch({ type: SET_REPORT_YEAR,year  });
  };
};

export const setReportMonth = (month) => {
  return (dispatch) => {
    dispatch({ type: SET_REPORT_MONTH,month  });
  };
};
