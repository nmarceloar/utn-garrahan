package p2018.backend.controllers;

import java.util.ArrayList;
import java.util.Iterator;
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

import p2018.backend.entities.Irradiation;
import p2018.backend.entities.Unit;
import p2018.backend.repository.IrradiationRepository;
import p2018.backend.repository.UnitRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins="http://localhost:4200", allowedHeaders="*")
public class IrradiationController {
	
	@Autowired
	private IrradiationRepository irradiationRepository;
	
	@Autowired
	private UnitRepository unitRepository;
	
	@GetMapping("/irradiations")
	public List<Irradiation> getIrradiations(){
		return irradiationRepository.findAll();
	}
	
	@GetMapping("/irradiations/{id}")
	public Irradiation getIrradiation(@PathVariable Long id){
		return irradiationRepository.getOne(id);
	}
	
	@DeleteMapping("/irradiations/{id}")
	public boolean deleteIrradiation(@PathVariable Long id){
		irradiationRepository.deleteById(id);
		return true;
	}
	
	@PutMapping("/irradiations")
	public Irradiation updateIrradiation(@RequestBody Irradiation rradiation){
		return irradiationRepository.save(rradiation);
	}
	
	@PostMapping("/orders/{id}/irradiations")
	public Irradiation createIrradiation(@RequestBody Irradiation irradiation, @PathVariable long id){
		
		irradiation.setOrderId(id);
		Iterator<Long> iterator = irradiation.getUnits().iterator();
		List<Unit> units = new ArrayList<Unit>();
	    while(iterator.hasNext()) {
	        Long unitId = iterator.next();
	        Unit unitTemp = unitRepository.getOne(unitId);
	        unitTemp.setIrradiated(true);
	        units.add(unitTemp);
	    }
	    
	    Irradiation saveIrradiation =  irradiationRepository.save(irradiation);
	    unitRepository.saveAll(units);
	    
	    return saveIrradiation;
	}

}
