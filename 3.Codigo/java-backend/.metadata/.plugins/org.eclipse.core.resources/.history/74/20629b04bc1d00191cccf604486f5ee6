package p2018.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import p2018.backend.entities.Institution;
import p2018.backend.repository.InstitutionRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="http://localhost:4200", allowedHeaders="*")
public class InstitutionContraller {
	
	@Autowired
	private InstitutionRepository institutionRepository;
	
	@GetMapping("/institutions")
	public List<Institution> getInstitutions(){
		return institutionRepository.findAll();
	}
	
	@GetMapping("/institution/{id}")
	public Institution getInstitution(@PathVariable Long id){
		return institutionRepository.getOne(id);
	}
	
	@DeleteMapping("/institution/{id}")
	public boolean deleteInstitution(@PathVariable Long id){
		institutionRepository.deleteById(id);
		return true;
	}
	
	@PostMapping("/institution")
	public Institution createInstitution(@RequestBody Institution institution){
		return institutionRepository.save(institution);
	}
	
	@PutMapping("/institution")
	public Institution updateInstitution(@RequestBody Institution institution){
		return institutionRepository.save(institution);
	}

}
