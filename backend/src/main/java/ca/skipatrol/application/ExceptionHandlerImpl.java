package ca.skipatrol.application;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;

@RestControllerAdvice
public class ExceptionHandlerImpl {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<HashMap<String, String>> handleException(HttpServletRequest request, Exception e) {
        e.printStackTrace();

        HashMap<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<HashMap<String, String>> handleNotFoundResourceException(HttpServletRequest request, NoHandlerFoundException e) {
        e.printStackTrace();

        HashMap<String, String> response = new HashMap<>();
        response.put("status", "error");
        response.put("message", "Requested endpoint is unavailable");
        return ResponseEntity.badRequest().body(response);
    }

}