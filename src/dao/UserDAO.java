package dao;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.ObjectWriter;

import entities.User;

public class UserDAO {
	private Map<String, User> users = new HashMap<>();
	private String contextPath = "";
	
	public UserDAO() {
		loadUsers();
	}
	
	public UserDAO(String contextPath) {
		this.contextPath = contextPath;
		loadUsers();
	}
	
	public User findByUsernameAndPassword(String username, String password) {
		if (!users.containsKey(username)) {
			return null;
		}
		User user = users.get(username);
		if (!user.getPassword().equals(password)) {
			return null;
		}
		return user;
	}
	
	public User findByUsername(String username) {
		if (!users.containsKey(username)) {
			return null;
		}
		User user = users.get(username);
		return user;
	}
	
	public Collection<User> findAll() {
		return users.values();
	}
	
	public void loadUsers() {
		BufferedReader reader = null;
		try {
			File file = new File(contextPath + "storage\\users.txt");
			reader = new BufferedReader(new FileReader(file));
			String json = reader.lines().collect(Collectors.joining());
			System.out.println(json);
			Collection<User> uList = new ObjectMapper().readValue(json, new TypeReference<List<User>>(){});
			
			for(User u : uList) {
				users.put(u.getUsername(), u);
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		} finally {
			if (reader != null) {
				try {
					reader.close();
				}
				catch (Exception e) { }
			}
		}
	}
	
	public void addUser(User user) {
		File file = new File(contextPath + "storage\\users.txt");
		
		users.put(user.getUsername(), user);
		
		BufferedWriter writer = null;
		try {
		    ObjectWriter ow = new ObjectMapper().writer().withDefaultPrettyPrinter();
		    String json = ow.writeValueAsString(users.values());

		    writer = new BufferedWriter(new FileWriter(file));
		    writer.write(json);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if ( writer != null ) {
				try {
					writer.close();
				}
				catch (Exception e) { }
			}
		}
	}
	
}