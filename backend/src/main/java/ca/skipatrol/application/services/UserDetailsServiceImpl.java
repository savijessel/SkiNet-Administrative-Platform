package ca.skipatrol.application.services;

import ca.skipatrol.application.models.EventRole;
import ca.skipatrol.application.models.User;
import ca.skipatrol.application.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
class UserDetailsServiceImpl implements UserDetailsService {

    Logger logger = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    @Autowired
    UserRepository userRepository;
    

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Failed username lookup"));
        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
        grantedAuthorities.add(new SimpleGrantedAuthority(retrieveUserRole(user.getUserType())));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), grantedAuthorities);
    }

    private String retrieveUserRole(EventRole eventRole)
    {
        try
        {
            if (eventRole == EventRole.SYSTEM_ADMIN)
                return "ADMIN";
            else
                return "USER";
        }
        catch(Exception ex)
        {
            return "USER";
        }
    }

}