package cl.usach.kafkaStorm.mcdw;


import backtype.storm.Config;
import backtype.storm.spout.SpoutOutputCollector;
import backtype.storm.task.TopologyContext;
import backtype.storm.topology.OutputFieldsDeclarer;
import backtype.storm.topology.base.BaseRichSpout;
import backtype.storm.tuple.Fields;
import backtype.storm.tuple.Values;
import backtype.storm.utils.Utils;

import com.google.common.base.Preconditions;

import java.util.Map;
import java.util.concurrent.LinkedBlockingQueue;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.StringTokenizer;

public class SpoutTest extends BaseRichSpout {
	private SpoutOutputCollector collector;
	private LinkedBlockingQueue<String> queue;
	private File f;
    private FileReader fr;
    private BufferedReader br;
	public void open(Map conf, TopologyContext context,SpoutOutputCollector collector) {
		this.collector = collector;
	}
	
	public void leerFichero(SpoutOutputCollector collector) {
        String direccionTexto = "/home/miguel/workspace/mcdw/vote-info.log";
        String user;
        String color;
        try {
            f = new File(direccionTexto);
            fr = new FileReader(f);
            br = new BufferedReader(fr);
            String linea;

            while ((linea = br.readLine()) != null) {
                 StringTokenizer separarLinea = new StringTokenizer(linea, "-");

                try {
                    user = separarLinea.nextToken();
                    color = separarLinea.nextToken();
                    //System.out.println(user);
                    //System.out.println(color);
                    collector.emit(new Values(user,color));
                } catch (Exception e) {
                    e.printStackTrace();
                }                         
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (fr != null) {
                    fr.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
    }
	
	public void nextTuple(){
		leerFichero(collector);
		Utils.sleep(5000);
	}
	public void declareOutputFields(OutputFieldsDeclarer declarer) {
		declarer.declare(new Fields("user","color"));
	}
		
}
