package com.example.session_controllers;

import com.example.entities.SessionType;
import com.example.repositories.SessionTypeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SessionTypeService {


    private final SessionTypeRepository sessionTypeRepository;

    public SessionTypeService(SessionTypeRepository sessionTypeRepository) {
        this.sessionTypeRepository = sessionTypeRepository;
    }


    public SessionType findById(Integer id) {
        Optional<SessionType> sessionType = sessionTypeRepository.findById(id);
        return sessionType.orElse(null);
    }

    public SessionType findByName(String name) {
        List<SessionType> sessionType = sessionTypeRepository.findByName(name);
        return sessionType.isEmpty() ? null : sessionType.get(0);
    }
}
