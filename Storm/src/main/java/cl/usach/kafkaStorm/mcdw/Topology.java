package cl.usach.kafkaStorm.mcdw;

import backtype.storm.Config;
import backtype.storm.LocalCluster;
import backtype.storm.spout.SchemeAsMultiScheme;
import backtype.storm.topology.TopologyBuilder;
import backtype.storm.tuple.Fields;
import storm.kafka.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;

public class Topology {
	 private static final String TOPOLOGY_NAME = "kafkaStormColorCount";
	 volatile static boolean finishedCollecting = false;
	 private static String zkConnString = "localhost:2181";
	 private static String topicName = "voteLog";
	
	public static void main(String[] args){
		BrokerHosts hosts = new ZkHosts(zkConnString);
		SpoutConfig spoutConfig = new SpoutConfig(hosts, topicName, "/kafkastorm", "discovery");
		spoutConfig.scheme = new SchemeAsMultiScheme(new StringScheme());
		KafkaSpout kafkaSpout = new KafkaSpout(spoutConfig);
		
		TopologyBuilder builder = new TopologyBuilder();
		builder.setSpout("KafkaStormSpout", kafkaSpout,1);
		builder.setBolt("AdministratorBolt", new AdministratorBolt()).shuffleGrouping("KafkaStormSpout");
		builder.setBolt("CounterBolt", new CounterBolt())
		.setNumTasks(4)
		.fieldsGrouping("AdministratorBolt", new Fields("key"));
		builder.setBolt("MergeBolt", new MergeBolt()).shuffleGrouping("CounterBolt");
		builder.setBolt("MongoBolt", new MongoBolt()).shuffleGrouping("MergeBolt");
		
		Config config = new Config();
		config.setMessageTimeoutSecs(120);
		
		final LocalCluster cluster = new LocalCluster();
		cluster.submitTopology(TOPOLOGY_NAME, config, builder.createTopology());
		
		Runtime.getRuntime().addShutdownHook(new Thread() {
			@Override
			public void run() {
			cluster.killTopology(TOPOLOGY_NAME);
			cluster.shutdown();
			}
		});
		
		
		
	}
}
