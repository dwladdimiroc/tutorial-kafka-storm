package cl.usach.kafkaStorm.mcdw;

import backtype.storm.task.OutputCollector;
import backtype.storm.task.TopologyContext;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseRichBolt;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Tuple;
import backtype.storm.tuple.Values;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

public class MergeBolt extends BaseRichBolt{
	private OutputCollector collector;
	private Map<String, Long> contador;
	private Map<String, Long> red;
	private Map<String, Long> blue;
	private Map<String, Long> yellow;
	private int count;
	private Long acumuladorRed;
	private Long acumuladorYellow;
	private Long acumuladorBlue;
	
	
	public MergeBolt(){
		this.count = 0;
		blue = new HashMap<String, Long>();
		red = new HashMap<String, Long>();
		yellow = new HashMap<String, Long>();
	}
	
	public void prepare(Map map, TopologyContext topologycontext, OutputCollector collector){
		this.collector = collector;
		

	}
	
	public void execute(Tuple input){
		HashMap<String, Long> temp;
		String color = input.getValueByField("color").toString();
		this.count++;
		
		System.out.println("MergeBolt " + input.getValueByField("color").toString() + " " + input.getValueByField("keymap").toString());
		
		if(color.equals("yellow")){
			temp = (HashMap<String, Long>) input.getValueByField("keymap");
			for(String user : temp.keySet()){
				if(yellow.containsKey(user)){
					Long count = temp.get(user) + yellow.get(user);
					yellow.put(user, count);
				} else {
					yellow.put(user, temp.get(user));
				}
			}
				
		} else if (color.equals("blue")) {
			temp = (HashMap<String, Long>) input.getValueByField("keymap");
			for(String user : temp.keySet()){
				if(blue.containsKey(user)){
					Long count = temp.get(user) + blue.get(user);
					blue.put(user, count);
				} else {
					blue.put(user, temp.get(user));
				}
			}
		} else { //red
			temp = (HashMap<String, Long>) input.getValueByField("keymap");
			for(String user : temp.keySet()){
				if(red.containsKey(user)){
					Long count = temp.get(user) + red.get(user);
					red.put(user, count);
				} else {
					red.put(user, temp.get(user));
				}
			}
		}	
		
		if(this.count>2){
			System.out.println("Yellow " + yellow.toString());
			System.out.println("Blue " + blue.toString());
			System.out.println("Red " + red.toString());
			collector.emit(new Values(red,blue,yellow));
		}
		//collector.emit(tuple);
		
	}
	
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("red","blue","yellow"));
	}
	
	
}
