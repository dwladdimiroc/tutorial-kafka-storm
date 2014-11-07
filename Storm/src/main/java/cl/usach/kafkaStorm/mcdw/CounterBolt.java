package cl.usach.kafkaStorm.mcdw;

import backtype.storm.task.OutputCollector;
import backtype.storm.task.TopologyContext;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseRichBolt;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Tuple;
import backtype.storm.tuple.Values;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

public class CounterBolt extends BaseRichBolt{
	private OutputCollector collector;
	private Map<String, Long> contador;
	private int count;
	
	public CounterBolt() {
		this.count=0;
	}
	
	public void prepare(Map map, TopologyContext topologycontext, OutputCollector collector){
		this.collector = collector;
		contador = new HashMap<String, Long>();
	}
	
	public void execute(Tuple input){
		//System.out.println(input.getSourceTask());
		String color = (String)input.getValueByField("key");
		String user =(String)input.getValueByField("msg");
		Long count = contador.get(user);
		
		count = count == null ? 1L : count + 1;
		contador.put(user,count);
		
		this.count++;
		
		if(this.count > 1){
			System.out.println("CounterBolt " + color + " " + contador.toString());
			collector.emit(new Values(contador, color));
			this.count=0;
			contador.clear();
		}
		
				
	}
	
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("keymap","color"));
	}
}
