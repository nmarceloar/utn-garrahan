package p2018.backend.utils;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;

public class EntitySpecificationsBuilder {
	
	private final List<SearchCriteria> params;
	 
    public EntitySpecificationsBuilder() {
        params = new ArrayList<SearchCriteria>();
    }
 
    public EntitySpecificationsBuilder with(String key, String operation, Object value) {
        params.add(new SearchCriteria(key, operation, value));
        return this;
    }
 
    public Specification<Serializable> build() {
        if (params.size() == 0) {
            return null;
        }
 
        List<Specification> specs = params.stream()
          .map(OrderInfoSpecification::new)
          .collect(Collectors.toList());
         
        Specification result = specs.get(0);
 
        for (int i = 1; i < params.size(); i++) {
            result = params.get(i)
              .isOrPredicate()
                ? Specification.where(result)
                  .or(specs.get(i))
                : Specification.where(result)
                  .and(specs.get(i));
        }       
        return result;
    }
}
