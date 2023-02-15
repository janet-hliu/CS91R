
function demo() {
	var interval_0_3 = new Interval(0, 3);
	console.log('0 to 3', interval_0_3.toString());
	console.log('len', interval_0_3.getLength())
	
	var interval_0_1 = new Interval(0, 1);
	console.log('0 to 1', interval_0_1.toString());
	
	var interval_2_5 = new Interval(2, 5);
	console.log('2 to 5', interval_2_5.toString());
	
	var interval_20_50 = new Interval(20, 50);
	console.log('20 to 50', interval_20_50.toString());

  console.log('0-3 contains interval 0-1',
  		interval_0_3.containsInterval(interval_0_1));
  console.log('0-3 contains 0-1',
  		interval_0_3.contains(0, 1));

  console.log('0-3 contains interval 2-5',
  		interval_0_3.containsInterval(interval_2_5));
  console.log('0-3 contains 2-5',
  		interval_0_3.contains(2, 5));

  console.log('0-3 intersects interval 2-5',
  		interval_0_3.intersects(interval_2_5));

  console.log('0-3 intersects interval 20-50',
  		interval_0_3.intersects(interval_20_50));
}