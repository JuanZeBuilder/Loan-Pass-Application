package g2t1.corppass.payloads.response;

import java.util.Optional;

public class ApiResponse<T> {
  private int statusCode;
  private Optional<String> message;
  private Optional<T> data;

  public ApiResponse(int statusCode, String message, T data) {
    this.statusCode = statusCode;
    this.message = Optional.ofNullable(message);
    this.data = Optional.ofNullable(data);
  }

  public ApiResponse(int statusCode, T data) {
    this(statusCode, null, data);
  }

  public ApiResponse(int statusCode, String message) {
    this(statusCode, message, null);
  }

  public int getStatusCode() {
    return statusCode;
  }

  public void setStatusCode(int statusCode) {
    this.statusCode = statusCode;
  }

  public String getMessage() {
    return message.orElse(null);
  }

  public void setMessage(String message) {
    this.message = Optional.ofNullable(message);
  }

  public T getData() {
    return data.orElse(null);
  }

  public void setData(Optional<T> data) {
    this.data = data;
  }
}
