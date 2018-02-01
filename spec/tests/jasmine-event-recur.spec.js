'use strict';

var moment = require('moment');
require('moment-timezone');
require('../../moment-recur');

// TOTEST:
// Export Rules
// Repeats function

var startDate = '2013-01-01';
var endDate = '2014-01-01';
var dateFormat = 'YYYY-MM-DD';

describe('Creating a recurring moment', function () {
  var nowMoment = moment();
  var nowDate = nowMoment.format(dateFormat);


  it('from moment constructor, with options parameter - moment.recur(options)', function () {
    var recur = moment.recur({ start: startDate, end: endDate });

    expect(recur.start.format(dateFormat)).toBe(startDate);
    expect(recur.end.format(dateFormat)).toBe(endDate);
  });

  it('from moment constructor, with start parameter only - moment.recur(start)', function () {
    var recur = moment.recur(startDate);

    expect(recur.start.format(dateFormat)).toBe(startDate);
  });

  it('from moment constructor, with start and end parameters - moment.recur(start, end)', function () {
    var recur = moment.recur(startDate, endDate);

    expect(recur.start.format(dateFormat)).toBe(startDate);
    expect(recur.end.format(dateFormat)).toBe(endDate);
  });

  it('from moment function, with options parameter - moment().recur(options)', function () {
    var recur = moment().recur({ start: startDate, end: endDate });

    expect(recur.start.format(dateFormat)).toBe(startDate);
    expect(recur.end.format(dateFormat)).toBe(endDate);
  });

  it('from moment function, with start and end parameters - moment().recur(start, end)', function () {
    var recur = moment().recur(startDate, endDate);

    expect(recur.start.format(dateFormat)).toBe(startDate);
    expect(recur.end.format(dateFormat)).toBe(endDate);
  });

  it('from moment function, with starting moment and end parameter - moment(start).recur(end)', function () {
    var recur = moment(startDate).recur(endDate);

    expect(recur.start.format(dateFormat)).toBe(startDate);
    expect(recur.end.format(dateFormat)).toBe(endDate);
  });

  it('from moment function, starting now, with end parameter  - moment().recur(end)', function () {
    var recur = nowMoment.recur(endDate);

    expect(recur.start.format(dateFormat)).toBe(nowDate);
    expect(recur.end.format(dateFormat)).toBe(endDate);
  });

  it('from moment function, starting now - moment().recur()', function () {
    var recur = nowMoment.recur();

    expect(recur.start.format(dateFormat)).toBe(nowDate);
  });

  it('from moment function, with starting moment and end parameter, which is a moment object - moment(start).recur(end)', function () {
    var startMoment = moment(startDate);
    var endMoment = moment(endDate);
    var recur = moment(startMoment).recur(endMoment);

    expect(recur.start.format(dateFormat)).toBe(startDate);
    expect(recur.end.format(dateFormat)).toBe(endDate);
  });
});

describe('Setting', function () {
  var recur;

  beforeEach(function () {
    recur = moment().recur();
  });

  it("'start' should be getable/setable with startDate()", function () {
    recur.startDate(startDate);

    expect(recur.startDate().format(dateFormat)).toBe(startDate);
  });

  it("'end' should be getable/setable with endDate()", function () {
    recur.endDate(endDate);

    expect(recur.endDate().format(dateFormat)).toBe(endDate);
  });

  it("'from' should be getable/setable with fromDate()", function () {
    recur.fromDate(startDate);

    expect(recur.fromDate().format(dateFormat)).toBe(startDate);
  });
});

describe('The every() function', function () {
  it('should create a rule when a unit and measurement is passed', function () {
    var recurrence = moment().recur().every(1, 'day');

    expect(recurrence.save().rules.length).toBe(1);
  });

  it('should not create a rule when only a unit is passed', function () {
    var recurrence = moment().recur().every(1);

    expect(recurrence.save().rules.length).toBe(0);
  });

  it('should set the temporary units property', function () {
    var recurrence = moment().recur().every(1);

    expect(recurrence.units).not.toBeNull();
  });

  it('should accept an array', function () {
    var recurrence = moment().recur().every([1, 2]);

    expect(recurrence.units).not.toBeNull();
  });
});

describe('An interval', function () {
  it('should not match a date before the start date', function () {
    var start = moment(startDate);
    var before = start.clone().subtract(1, 'day');
    var recurrence = start.recur();
    recurrence.every(1, 'day');

    expect(recurrence.matches(before)).toBe(false);
  });

  it('should not match a date after the end date', function () {
    var start = moment(startDate);
    var after = moment(endDate).add(1, 'day');
    var recurrence = start.recur();
    recurrence.endDate(endDate).every(1, 'day');

    expect(recurrence.matches(after)).toBe(false);
  });

  it('can be daily', function () {
    var recurrence = moment(startDate).recur().every(2).days();

    expect(recurrence.matches(moment(startDate).add(2, 'days'))).toBe(true);
    expect(recurrence.matches(moment(startDate).add(3, 'days'))).toBe(false);
  });

  it('can be weekly', function () {
    var recurrence = moment(startDate).recur().every(2).weeks();

    expect(recurrence.matches(moment(startDate).add(2, 'weeks'))).toBe(true);
    expect(recurrence.matches(moment(startDate).add(2, 'days'))).toBe(false);
    expect(recurrence.matches(moment(startDate).add(3, 'weeks'))).toBe(false);
  });

  it('can be monthly', function () {
    var recurrence = moment(startDate).recur().every(3).months();

    expect(recurrence.matches(moment(startDate).add(3, 'months'))).toBe(true);
    expect(recurrence.matches(moment(startDate).add(2, 'months'))).toBe(false);
    expect(recurrence.matches(moment(startDate).add(2, 'days'))).toBe(false);
  });

  it('can be yearly', function () {
    var recurrence = moment(startDate).recur().every(2).years();

    expect(recurrence.matches(moment(startDate).add(2, 'year'))).toBe(true);
    expect(recurrence.matches(moment(startDate).add(3, 'year'))).toBe(false);
    expect(recurrence.matches(moment(startDate).add(2, 'days'))).toBe(false);
  });

  it('can be an array of intervals', function () {
    var recurrence = moment(startDate).recur().every([3, 5]).days();

    expect(recurrence.matches(moment(startDate).add(3, 'days'))).toBe(true);
    expect(recurrence.matches(moment(startDate).add(5, 'days'))).toBe(true);
    expect(recurrence.matches(moment(startDate).add(10, 'days'))).toBe(true);
    expect(recurrence.matches(moment(startDate).add(4, 'days'))).toBe(false);
    expect(recurrence.matches(moment(startDate).add(8, 'days'))).toBe(false);
  });
});

describe('The Calendar Interval', function () {
  describe('daysOfWeek', function () {
    it('should work', function () {
      var recurrence = moment.recur().every(['Sunday', 1]).daysOfWeek();

      expect(recurrence.matches(moment().day('Sunday'))).toBe(true);
      expect(recurrence.matches(moment().day(1))).toBe(true);
      expect(recurrence.matches(moment().day(3))).toBe(false);
    });

    it('should work with timezones', function () {
      var recurrence = moment.tz('2015-01-25', 'America/Vancouver').recur().every(['Sunday', 1]).daysOfWeek();
      var recurrence2 = moment.tz('2015-01-25', 'Asia/Hong_Kong').recur().every(['Sunday', 1]).daysOfWeek();
      var recurrence3 = moment.tz('2015-01-25', 'Pacific/Funafuti').recur().every(['Sunday', 1]).daysOfWeek();
      var recurrence4 = moment.tz('2015-01-25', 'Pacific/Wallis').recur().every(['Sunday', 1]).daysOfWeek();

      expect(recurrence.toJSON()).toEqual(recurrence2.toJSON());
      expect(recurrence3.toJSON()).toEqual(recurrence4.toJSON());
      expect(recurrence.toJSON()).toEqual(recurrence4.toJSON());
    });
  });

  it('daysOfMonth should work', function () {
    var recurrence = moment('2015-01-01').recur().every([1, 10]).daysOfMonth();

    expect(recurrence.matches(moment('2015-01-01'))).toBe(true);
    expect(recurrence.matches(moment('2015-01-02'))).toBe(false);
    expect(recurrence.matches(moment('2015-01-10'))).toBe(true);
    expect(recurrence.matches(moment('2015-01-15'))).toBe(false);
    expect(recurrence.matches(moment('2015-02-01'))).toBe(true);
    expect(recurrence.matches(moment('2015-02-02'))).toBe(false);
    expect(recurrence.matches(moment('2015-02-10'))).toBe(true);
    expect(recurrence.matches(moment('2015-02-15'))).toBe(false);
  });

  it('daysOfMonth should recur on 31st or last day of month', function () {
    var recurrence = moment('2012-01-31').recur().every(31)
      .daysOfMonth();

    var upcoming = recurrence.next(13);

    expect(upcoming[0].toISOString()).toBe(moment('2012-02-29').toISOString());
    expect(upcoming[1].toISOString()).toBe(moment('2012-03-31').toISOString());
    expect(upcoming[2].toISOString()).toBe(moment('2012-04-30').toISOString());
    expect(upcoming[12].toISOString()).toBe(moment('2013-02-28').toISOString());
  });

  it('daysOfMonth should recur on 30th or last day of month', function () {
    var recurrence = moment('2012-01-31').recur().every(30)
      .daysOfMonth();

    var upcoming = recurrence.next(13);

    expect(upcoming[0].toISOString()).toBe(moment('2012-02-29').toISOString());
    expect(upcoming[1].toISOString()).toBe(moment('2012-03-30').toISOString());
    expect(upcoming[2].toISOString()).toBe(moment('2012-04-30').toISOString());
    expect(upcoming[12].toISOString()).toBe(moment('2013-02-28').toISOString());
  });

  it('daysOfMonth should recur on 29th or last day of month', function () {
    var recurrence = moment('2012-01-31').recur().every(29)
      .daysOfMonth();

    var upcoming = recurrence.next(13);

    expect(upcoming[0].toISOString()).toBe(moment('2012-02-29').toISOString());
    expect(upcoming[1].toISOString()).toBe(moment('2012-03-29').toISOString());
    expect(upcoming[2].toISOString()).toBe(moment('2012-04-29').toISOString());
    expect(upcoming[12].toISOString()).toBe(moment('2013-02-28').toISOString());
  });

  it('weeksOfMonth should work', function () {
    var recurrence = moment.recur().every([1, 3]).weeksOfMonth();

    expect(recurrence.matches(moment(startDate).date(6))).toBe(true);
    expect(recurrence.matches(moment(startDate).date(26))).toBe(true);
    expect(recurrence.matches(moment(startDate).date(27))).toBe(false);
  });

  it('weeksOfYear should work', function () {
    var recurrence = moment.recur().every(20).weekOfYear();

    expect(recurrence.matches(moment('2014-05-14'))).toBe(true);
    expect(recurrence.matches(moment(startDate))).toBe(false);
  });

  it('monthsOfYear should work', function () {
    var recurrence = moment.recur().every('January').monthsOfYear();

    expect(recurrence.matches(moment().month('January'))).toBe(true);
    expect(recurrence.matches(moment().month('February'))).toBe(false);
  });

  it('rules can be combined', function () {
    var valentines = moment.recur().every(14).daysOfMonth()
      .every('Februray')
      .monthsOfYear();

    expect(valentines.matches(moment('2014-02-14'))).toBe(true);
    expect(valentines.matches(moment(startDate))).toBe(false);
  });

  it('can be passed units, without every()', function () {
    var recurrence = moment.recur().daysOfMonth([1, 3]);

    expect(recurrence.matches('2014-01-01')).toBe(true);
    expect(recurrence.matches('2014-01-03')).toBe(true);
    expect(recurrence.matches('2014-01-06')).toBe(false);
  });
});

describe('Rules', function () {
  it('should be overridden when duplicated', function () {
    var recurrence = moment('2014-01-01').recur().every(1).day();
    recurrence.every(2).days();

    expect(recurrence.rules.length).toBe(1);
  });

  it('should be forgettable', function () {
    var recurrence = moment('2014-01-01').recur().every(1).day();
    recurrence.forget('days');

    expect(recurrence.rules.length).toBe(0);
  });

  it('should be possible to see if one exists', function () {
    var recurrence = moment('2014-01-01').recur().every(1).day();

    expect(recurrence.hasRule('days')).toBe(true);
    expect(recurrence.hasRule('months')).toBe(false);
  });
});

describe('weeksOfMonthByDay()', function () {
  it('can recur on the 1st and 3rd Sundays of the month', function () {
    var recurrence;
    recurrence = moment.recur()
      .every(['Sunday']).daysOfWeek()
      .every([0, 2])
      .weeksOfMonthByDay();

    expect(recurrence.matches(moment(startDate))).toBe(false);
    expect(recurrence.matches(moment(startDate).date(6))).toBe(true);
    expect(recurrence.matches(moment(startDate).date(8))).toBe(false);
    expect(recurrence.matches(moment(startDate).date(13))).toBe(false);
    expect(recurrence.matches(moment(startDate).date(20))).toBe(true);
    expect(recurrence.matches(moment(startDate).date(27))).toBe(false);
  });

  it('can recur on the 2nd, 4th and 5th Sundays and Thursdays of the month', function () {
    var recurrence;
    recurrence = moment.recur()
      .every(['Sunday', 'Thursday']).daysOfWeek()
      .every([1, 3, 4])
      .weeksOfMonthByDay();

    expect(recurrence.matches(moment(startDate).date(6))).toBe(false);
    expect(recurrence.matches(moment(startDate).date(13))).toBe(true);
    expect(recurrence.matches(moment(startDate).date(20))).toBe(false);
    expect(recurrence.matches(moment(startDate).date(27))).toBe(true);
    expect(recurrence.matches(moment(startDate).date(3))).toBe(false);
    expect(recurrence.matches(moment(startDate).date(10))).toBe(true);
    expect(recurrence.matches(moment(startDate).date(17))).toBe(false);
    expect(recurrence.matches(moment(startDate).date(24))).toBe(true);
    expect(recurrence.matches(moment(startDate).date(31))).toBe(true);
  });

  it('can recur on the 4th Wednesday of the month', function () {
    var recurrence;
    recurrence = moment.recur()
      .every(moment('2017-09-27').day()).daysOfWeek()
      .every(moment('2017-09-27').monthWeekByDay())
      .weeksOfMonthByDay();

    expect(recurrence.matches(moment('2017-09-27'))).toBe(true);
    expect(recurrence.matches(moment('2017-10-25'))).toBe(true);
    expect(recurrence.matches(moment('2017-11-22'))).toBe(true);
    expect(recurrence.matches(moment('2017-12-27'))).toBe(true);
  });

  it('will throw an error if used without daysOfWeek()', function () {
    var caught = { message: false };
    try {
      moment.recur().every(0).weeksOfMonthByDay();
    } catch (e) {
      caught = e;
    }

    expect(caught.message).toBe('weeksOfMonthByDay must be combined with daysOfWeek');
  });
});

describe('Future Dates', function () {
  it('can be generated', function () {
    var recurrence,
      nextDates;
    recurrence = moment('2014-01-01').recur().every(2).days();
    nextDates = recurrence.next(3, dateFormat);

    expect(nextDates.length).toBe(3);
    expect(nextDates[0]).toBe('2014-01-03');
    expect(nextDates[1]).toBe('2014-01-05');
    expect(nextDates[2]).toBe('2014-01-07');
  });

  it("can start from a temporary 'from' date", function () {
    var recurrence = moment('2014-01-01').recur().every(2).days();
    recurrence.fromDate('2014-02-05');
    var nextDates = recurrence.next(3, dateFormat);

    expect(nextDates.length).toBe(3);
    expect(nextDates[0]).toBe('2014-02-06');
    expect(nextDates[1]).toBe('2014-02-08');
    expect(nextDates[2]).toBe('2014-02-10');
  });

  it('should use timeOfDay if applied', function () {
    var recurrence = moment('2014-01-01')
      .add(7, 'hours')
      .recur().every(2)
      .days();

    recurrence.fromDate('2014-02-05');
    var nextDates = recurrence.next(3);

    expect(recurrence.start).toEqual(moment('2014-01-01'));
    expect(recurrence.timeOfDay).toBe(25200000);

    expect(nextDates.length).toBe(3);
    expect(nextDates[0].toISOString()).toEqual(moment('2014-02-06').add(7, 'hours').toISOString());
    expect(nextDates[1].toISOString()).toEqual(moment('2014-02-08').add(7, 'hours').toISOString());
    expect(nextDates[2].valueOf()).toEqual(moment('2014-02-10').add(7, 'hours').valueOf());
  });
});

describe('Previous Dates', function () {
  it('previous can be generated', function () {
    var recurrence = moment('2014-01-01').recur().every(2).days(),
      nextDates = recurrence.previous(3, dateFormat);

    expect(nextDates.length).toBe(3);
    expect(nextDates[0]).toBe('2013-12-30');
    expect(nextDates[1]).toBe('2013-12-28');
    expect(nextDates[2]).toBe('2013-12-26');
  });
});

describe('All Dates', function () {
  it('all can be generated', function () {
    var recurrence,
      allDates;
    recurrence = moment('2014-01-01').recur('2014-01-07').every(2).days();
    allDates = recurrence.all(dateFormat);

    expect(allDates.length).toBe(4);
    expect(allDates[0]).toBe('2014-01-01');
    expect(allDates[1]).toBe('2014-01-03');
    expect(allDates[2]).toBe('2014-01-05');
    expect(allDates[3]).toBe('2014-01-07');
  });

  it("all can start from a temporary 'from' date", function () {
    var recurrence,
      allDates;
    recurrence = moment().recur('2014-01-01', '2014-01-08').every(2).days();
    recurrence.fromDate('2014-01-05');
    allDates = recurrence.all(dateFormat);

    expect(allDates.length).toBe(2);
    expect(allDates[0]).toBe('2014-01-05');
    expect(allDates[1]).toBe('2014-01-07');
  });

  it('should throw error if start date is after end date', function () {
    var recurrence;

    recurrence = moment().recur('2017-07-26', '2013-08-01').every(2).days();

    expect(function () {
      recurrence.all(dateFormat);
    }).toThrow(new Error('Start date cannot be later than end date.'));
  });

  it('should only generate a single date when start date and end date are the same', function () {
    var recurrence,
      allDates;
    recurrence = moment().recur('2014-01-01', '2014-01-01').every(1).days();
    allDates = recurrence.all(dateFormat);

    expect(allDates.length).toBe(1);
    expect(allDates[0]).toBe('2014-01-01');
  });
});

describe('Exceptions', function () {
  var mo,
    exception,
    recur,
    exceptionWithTz;

  beforeEach(function () {
    mo = moment(startDate);
    exception = mo.clone().add(3, 'day');
    recur = mo.clone().recur().every(1, 'days');
    exceptionWithTz = moment.tz(exception.format('YYYY-MM-DD'), 'Asia/Hong_Kong');
  });

  it('should prevent exception days from matching', function () {
    recur.except(exception);

    expect(recur.matches(exception)).toBe(false);
  });

  it('should work when the passed in exception is in a different time zone', function () {
    recur.except(exception);

    expect(recur.matches(exceptionWithTz)).toBe(false);
  });

  it('should be removeable', function () {
    recur.except(exception);
    recur.forget(exception);

    expect(recur.matches(exception)).toBe(true);
  });
});

describe('Exceptions with weeks', function () {
  var mo,
    exception,
    recur,
    exceptionWithTz;

  beforeEach(function () {
    mo = moment(startDate);
    exception = mo.clone().add(7, 'day');
    recur = mo.clone().recur().every(1, 'weeks');
    exceptionWithTz = moment.tz(exception.format('YYYY-MM-DD'), 'Asia/Hong_Kong');
  });

  it('should not match on the exception day', function () {
    expect(recur.matches(exception)).toBe(true);
    recur.except(exception);

    expect(recur.matches(exception)).toBe(false);
  });

  it('should not match on the exception day for other timezone', function () {
    expect(recur.matches(exceptionWithTz)).toBe(true);
    recur.except(exception);

    expect(recur.matches(exceptionWithTz)).toBe(false);
  });
});

describe('Options', function () {
  it('should be importable', function () {
    var recurrence = moment().recur({
      start: '2014-01-01',
      end: '2014-12-31',
      timeOfDay: 500,
      rules: [
        { units: { 2: true }, measure: 'days' }
      ],
      exceptions: ['2014-01-05']
    });

    expect(recurrence.startDate().format(dateFormat)).toBe('2014-01-01');
    expect(recurrence.endDate().format(dateFormat)).toBe('2014-12-31');
    expect(recurrence.timeOfDay).toBe(500);
    expect(recurrence.rules.length).toBe(1);
    expect(recurrence.exceptions.length).toBe(1);
    expect(recurrence.matches('2014-01-03')).toBe(true);
    expect(recurrence.matches('2014-01-05')).toBe(false);
  });

  it('should be exportable with save', function () {
    var recurrence = moment('2014-01-01').recur('2014-12-31').every(2, 'days').except('2014-01-05');
    var data = recurrence.save();

    expect(data.start).toBe('2014-01-01');
    expect(data.timeOfDay).toBe(0);
    expect(data.end).toBe('2014-12-31');
    expect(data.exceptions[0]).toBe('2014-01-05');
    expect(data.rules[0].units[2]).toBe(true);
    expect(data.rules[0].measure).toBe('days');
  });

  it('shold be exportable with toJSON', function () {
    var recurrence = moment('2014-01-01').recur('2014-12-31').every(2, 'days').except('2014-01-05');
    var data = recurrence.toJSON();

    expect(data.start).toBe('2014-01-01');
    expect(data.end).toBe('2014-12-31');
    expect(data.timeOfDay).toBe(0);
    expect(data.exceptions[0]).toBe('2014-01-05');
    expect(data.rules[0].units[2]).toBe(true);
    expect(data.rules[0].measure).toBe('days');
  });

  it('shold export timeOfDay as separate property', function () {
    var recurrence = moment('2014-01-01').add(7, 'hours').add(50, 'minutes')
      .recur('2014-12-31')
      .every(2, 'days')
      .except('2014-01-05');

    var data = recurrence.toJSON();

    expect(data.timeOfDay).toBe(28200000);
  });
});

describe('The repeats() function', function () {
  it('should return true when there are rules set', function () {
    var recurrence = moment().recur().every(1).days();

    expect(recurrence.repeats()).toBe(true);
  });

  it('should return false when there are no rules set', function () {
    var recurrence = moment().recur();

    expect(recurrence.repeats()).toBe(false);
  });
});
