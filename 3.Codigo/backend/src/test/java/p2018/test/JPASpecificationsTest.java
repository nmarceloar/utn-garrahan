package p2018.test;

import javax.transaction.Transactional;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import p2018.backend.entities.User;
import p2018.backend.repository.UserRepository;
import p2018.test.conf.PersistenceJPAConfig;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { PersistenceJPAConfig.class })
@Transactional
@TestConfiguration
public class JPASpecificationsTest {
	
	@Autowired
    private UserRepository repository;
 
    private User userJohn;
    private User userTom;
 
    @Before
    public void init() {
    	
        userJohn = new User();
        userJohn.setFirstname("John");
        userJohn.setLastname("Doe");
        userJohn.setEmail("john@doe.com");
        userJohn.setActive(true);
        userJohn.setAccountConfirmed(true);
        userJohn.setAvatarUrl("/assets/avatar.svg");
        userJohn.setDni("12345678");
        userJohn.setEmailVerified(false);
        userJohn.setUsername("userJohn");
        repository.save(userJohn);
 
        userTom = new User();
        userTom.setFirstname("Tom");
        userTom.setLastname("Doe");
        userTom.setEmail("tom@doe.com");
        userTom.setActive(true);
        userTom.setAccountConfirmed(false);
        userTom.setAvatarUrl("/assets/avatar.svg");
        userTom.setDni("87654321");
        userTom.setEmailVerified(false);
        userTom.setUsername("userTom");
        repository.save(userTom);
    }
    
    @Test
    public void test() {
    	
    }
    
    @After
    public void finish() {
    	repository.delete(userTom);
    	repository.delete(userJohn);
    }
}
