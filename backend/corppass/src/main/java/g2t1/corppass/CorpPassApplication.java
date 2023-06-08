package g2t1.corppass;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.thymeleaf.ThymeleafAutoConfiguration;

@SpringBootApplication(exclude = { ThymeleafAutoConfiguration.class })
public class CorpPassApplication {

	public static void main(String[] args) {
		SpringApplication.run(CorpPassApplication.class, args);
	}
}
