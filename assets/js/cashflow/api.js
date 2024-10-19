// api.js
export async function fetchData(url, token, options = {}) {
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    throw new Error(`Failed to fetch from ${url}`);
  }

  return response.json();
}

// Helper function to make a POST request
export async function postData(url, data, token) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to post data: ${errorMessage}`);
  }

  return response.json();
}

// Helper function to make a PUT request
export async function putData(url, data, token) {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to update data: ${errorMessage}`);
  }

  return response.json();
}

// Helper function to make a DELETE request
export async function deleteData(url, token) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete data: ${errorMessage}`);
  }

  return response.json();
}
