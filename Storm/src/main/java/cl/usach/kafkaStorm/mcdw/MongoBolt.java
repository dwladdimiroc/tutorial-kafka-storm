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

import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;

public class MongoBolt extends BaseRichBolt{
	private OutputCollector collector;
	private Map<String, Long> contador;
	private Map<String, Long> red;
	private Map<String, Long> blue;
	private Map<String, Long> yellow;
	private int count;
	private Long acumuladorRed;
	private Long acumuladorYellow;
	private Long acumuladorBlue;
	private MongoConnection mongoConnection;
	
	
	public MongoBolt(){
		
	}
	
	public void prepare(Map map, TopologyContext topologycontext, OutputCollector collector){
		this.collector = collector;
		mongoConnection = new MongoConnection();
		mongoConnection.setupMongo();
	}
	
	public void execute(Tuple input){
		HashMap<String, Long> tempRed = (HashMap<String, Long>) input.getValueByField("red");
		long countRed = 0;
		for(String user : tempRed.keySet()){
			countRed += tempRed.get(user);
		}
		
		HashMap<String, Long> tempYellow = (HashMap<String, Long>) input.getValueByField("yellow");
		long countYellow = 0;
		for(String user : tempYellow.keySet()){
			countYellow += tempYellow.get(user);
		}
		
		HashMap<String, Long> tempBlue = (HashMap<String, Long>) input.getValueByField("blue");
		long countBlue = 0;
		for(String user : tempBlue.keySet()){
			countBlue += tempBlue.get(user);
		}
		
		DBObject objMongo = new BasicDBObject();

		objMongo.put("red", countRed);
		objMongo.put("yellow", countYellow);
		objMongo.put("blue", countBlue);
		
		mongoConnection.insert(objMongo);
	}
	
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		//Output
	}
	
	
}