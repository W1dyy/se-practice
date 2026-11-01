import copy
import unittest
from booking import can_book


class BookingTests(unittest.TestCase):
    def check(self, start, end, expected, now=540, blocked=False, existing=None):
        existing = [(600, 660)] if existing is None else existing
        self.assertIs(can_book(start, end, now, blocked, existing), expected)

    def test_touching_end(self):
        self.check(660, 720, True)

    def test_partial_overlap(self):
        self.check(630, 690, False)

    def test_blocked(self):
        self.check(660, 720, False, blocked=True)

    def test_exactly_120(self):
        self.check(720, 840, True)

    def test_121_minutes(self):
        self.check(720, 841, False)

    def test_starts_now(self):
        self.check(540, 570, False)

    def test_starts_before_now(self):
        self.check(539, 570, False)

    def test_starts_one_minute_after_now(self):
        self.check(541, 542, True)

    def test_reversed(self):
        self.check(720, 660, False)

    def test_zero_duration(self):
        self.check(720, 720, False)

    def test_negative_start(self):
        self.check(-1, 30, False, now=0, existing=[])

    def test_end_of_day(self):
        self.check(1380, 1440, True)

    def test_past_midnight(self):
        self.check(1380, 1441, False)

    def test_second_booking(self):
        self.check(720, 780, False, existing=[(600, 660), (700, 760)])

    def test_touching_start(self):
        self.check(570, 600, True)

    def test_contains_existing(self):
        self.check(590, 670, False)

    def test_contained_by_existing(self):
        self.check(610, 620, False)

    def test_identical_interval(self):
        self.check(600, 660, False)

    def test_overlap_ending_inside(self):
        self.check(590, 630, False)

    def test_no_bookings(self):
        self.check(600, 660, True, existing=[])

    def test_inputs_unchanged_after_repeated_success(self):
        existing = [[600, 660], [800, 850]]
        before = copy.deepcopy(existing)
        self.check(660, 720, True, existing=existing)
        self.check(660, 720, True, existing=existing)
        self.assertEqual(existing, before)

    def test_inputs_unchanged_after_rejection(self):
        existing = [[700, 760], [600, 660]]
        before = copy.deepcopy(existing)
        self.check(720, 780, False, existing=existing)
        self.assertEqual(existing, before)

    def test_unsorted_bookings_and_tuple(self):
        self.check(720, 780, False, existing=((900, 950), (700, 760)))

    def test_integer_minutes_required(self):
        for start, end in [(660.0, 720), (660, 720.5), (True, 2), ('660', 720)]:
            with self.subTest(start=start, end=end):
                self.check(start, end, False)


if __name__ == '__main__':
    unittest.main()
