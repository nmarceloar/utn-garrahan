package p2018.test;

import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertTrue;

import java.io.IOException;
import java.util.Iterator;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import p2018.backend.utils.OrderInfoSpecification;
import p2018.backend.utils.SearchCriteria;

@RunWith(SpringJUnit4ClassRunner.class)
public class ParseFilterRequest {
	
	private String filter = "{\"where\":{\"and\":[{\"institutionId\":5},{\"statusId\":\"PENDIENTE\"},{\"priorityId\":2}]},\"skip\":0,\"limit\":20,\"order\":[\"lastModified DESC\"],\"include\":[{\"units\":{\"type\":true}},{\"status\":true},{\"priority\":true},{\"owner\":true},{\"institution\":true}]}";
	
	
	public void ParseFilter(){
		
		ObjectMapper mapper = new ObjectMapper();
		Specification value = null;
		try {
			JsonNode actualTree = mapper.readTree(filter);
			Iterator<JsonNode> i = actualTree.elements();
			Integer checkPosition = 0;
			
			while (i.hasNext()) {
				JsonNode jsonNode = (JsonNode) i.next();
				
				if(jsonNode.get("institutionId") != null) {
					Long institutionId = new Long(jsonNode.get("institutionId").asInt());
					OrderInfoSpecification spec = new OrderInfoSpecification(new SearchCriteria("institutionId", ":", institutionId));
					if(checkPosition != 0) value = Specification.where(spec); else value = value.and(spec);
					checkPosition++;
				}
				
				if(jsonNode.get("statusId") != null) {
					String statusId = jsonNode.get("institutionId").toString();
					OrderInfoSpecification spec = new OrderInfoSpecification(new SearchCriteria("statusId", ":", statusId));
					if(checkPosition != 0) value = Specification.where(spec); else value = value.and(spec);
					checkPosition++;
				}
				
				if(jsonNode.get("priorityId") != null) {
					Long priorityId = new Long(jsonNode.get("priorityId").asInt());
					OrderInfoSpecification spec = new OrderInfoSpecification(new SearchCriteria("priorityId", ":", priorityId));
					if(checkPosition != 0) value = Specification.where(spec); else value = value.and(spec);
					checkPosition++;
				}
				
			}
			assertTrue(!actualTree.equals(null));
			assertNotEquals(null, value);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	@Test
	public void testJsonParser() {
		
		JSONObject resobj;
		try {
			resobj = new JSONObject(filter);
			Iterator<?> keys = resobj.keys();
			while(keys.hasNext() ) {
			    String key = (String)keys.next();
			    if ( resobj.get(key) instanceof JSONObject ) {
			        JSONObject wereNode = new JSONObject(resobj.get(key).toString());
			        Iterator<?> levelKeys = wereNode.keys();
			        while(levelKeys.hasNext() ) {
			        	String key2 = (String)levelKeys.next();
			        	if ( wereNode.get(key2) instanceof JSONObject ) {
			        		JSONObject filterNode = new JSONObject(wereNode.get(key2).toString());
			        		
			        		System.out.println("res1: " + filterNode.getString("institutionId"));
					        System.out.println("res2: " + filterNode.getString("statusId"));
			        	}	
			        }
			    }
			}
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
}
