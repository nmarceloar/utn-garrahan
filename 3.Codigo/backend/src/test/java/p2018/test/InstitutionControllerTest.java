package p2018.test;

import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.util.CollectionUtils;

import p2018.backend.controllers.InstitutionController;
import p2018.backend.entities.Institution;
import p2018.backend.entities.InstitutionType;

@RunWith(SpringRunner.class)
@WebMvcTest(value = InstitutionController.class, secure = false)
@SpringBootTest(classes = InstitutionController.class)
public class InstitutionControllerTest {
	 
	@Autowired
	private MockMvc mockMvc;
	
	@MockBean
	private InstitutionController institutionController;
	
	
	Institution intitutionMock = new Institution("Test","123456", "Catulo 1234", "test", new Integer(0), new Integer(0), new InstitutionType("PRIVADA", "Instituciones privadas de salud"));
	
	@Test
	public void getInstitutions() throws Exception {
		List<Institution> institutions = institutionController.getInstitutions();
		assertTrue(!CollectionUtils.isEmpty(institutions));
	}
}
