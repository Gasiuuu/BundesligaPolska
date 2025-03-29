package com.gasiuu.backend.repositories;

import com.gasiuu.backend.domain.entities.NewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<NewsEntity, Long> {
}
