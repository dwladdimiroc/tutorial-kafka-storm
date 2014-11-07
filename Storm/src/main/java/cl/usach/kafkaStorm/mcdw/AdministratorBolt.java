package cl.usach.kafkaStorm.mcdw;

import backtype.storm.task.OutputCollector;
import backtype.storm.task.TopologyContext;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseRichBolt;
import backtype.storm.tuple.Tuple;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Values;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.SortedMap;
import java.util.TreeMap;

public class AdministratorBolt extends BaseRichBolt {

	private OutputCollector collector;

	// private int expectedNumMessages;
	// private int countReceivedMessages = 0;

	public AdministratorBolt() {
		// this.expectedNumMessages = expectedNumMessages;
	}

	public void prepare(Map map, TopologyContext topologyContext,
			OutputCollector collector) {
		this.collector = collector;
	}

	public void execute(Tuple input){
		String text = (String) input.getValueByField("str");
		
		JSONParser jsonParser = new JSONParser();
		JSONObject jsonObject = null;
		try {
			jsonObject = (JSONObject) jsonParser.parse(text);
		} catch (ParseException e) {
			e.printStackTrace();
		}		
		JSONObject messange = null;
		try {
			messange = (JSONObject) jsonParser.parse((String) jsonObject.get("message"));
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		String msg = (String) messange.get("userLog");
		String color = (String) messange.get("voteLog");
		
		String key = "";
		
		if(color.equals("yellow")){
			key = "yellow";
		} else if (color.equals("blue")){
			key = "blue";
		} else {
			key = "red";
		}
		
		//System.out.println("user: " + msg + " vote: " + key);
		
		collector.emit(new Values(key, msg));
		
	}

	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("key", "msg"));
	}

}
