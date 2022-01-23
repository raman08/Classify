const { Storage } = require('@google-cloud/storage');

const keys = {
	type: 'service_account',
	project_id: 'virtial-classroom',
	private_key_id: '52bdef0219a16bef1f144d070f73fc1f2f4b0135',
	private_key:
		'-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC5VY+P1D5OI9M3\n/y7ERIu/33GRdVwOFfLOxpjRXYaIzy3WHTQn0sNSZrfquqesI65vwwL25Ea2Crqe\nhDxvSv9DLojsBd6RVpMl3b8fgBecMD1pjGWC8WP59eoK+OZxZY/eNWLyFFKRy4me\nKJ0973j9D9REgg+dedmv8nye3N0JD8zgE5M0w27JZ0QlSMGjOeVDo9kritrvImjo\nCp0mnVfu3Ao01LT8QS4ziFNWxXVcXj+Ut4Qx4MCJjAUo1tnhJW7ui6V2yHE2OyHP\ndoOkAJONSdgZjzsrM1DuNOT6PMak4bJEDUmI4ynAguTYXOKEbxkRQnCsDndwRYVs\n9zvkJNDHAgMBAAECggEAMDO9m+XSspYEuFqpOiitxCCENBW29H7m4LqsQj+13t0r\nibWcvALIBCVtDiKvu0iodK7elYH3lh8iPFoeMb/qtfljaSd5pIlEyiNrMvEostml\nD0+Rk0Xe/8LitSnZHYMRsPRnoJiChSLPzw+3HcWrzP2R8qN1Fjr70BQcL2E4J8O+\n2wgcejCUgAsQ+tiEFNppnOU/bPh6fWUSeNrIOhDMbm7Rv6yVCRgECSD0O7s9CHeR\nCzDtm1jW6tHDNbKGt0rxJzL/2mt0CRT9bm2Yo33nzBop++aKsQb1x2mxC1+2XHUA\nclef3SBDhuil6zRm4/1f3rNTmwyHgOc8lxxV1ETVCQKBgQD6OfVI76OHqs2+xCvk\nRzNeHpscbEb6w7h9LJSlro5ZY6QszCoqdjqzewsJWDx1FDW2AH/2AVXWU/0qu73F\n16g4r1AR1rQYzmZoi6R9Y3IZPhBnc7RCP/wKsIUEa/EWwNGQJZWAzrsSAW9uVxUA\nWzdzPjzG8DDGcfa18WlVN0I3RQKBgQC9nEvdhwcFV/LxtpQtYCIgPpGSOZEcn4w5\n8+I1NvNWNOZeYpvIHyEASHZcHKvdKB0ZqRgMZ929tnyLZ2jiJX1iq9krwx1GXBIV\neciTkLSESDIvPSZIuLofl1+y0mF3/MORSPSt94mhvS5VqRduNTqIlMAHr/+3Xrga\nDA3KEeiSmwKBgQDPSrxc08lRVrpjUvhZgHKZghlVjo2up/1qFUh/iP/8JYOYaPp1\nesRec4xNDX/oLfng8MEQ90I48BNHF4i7IVEGxJU8cfV4p2RHL4fxKDUZnETSrxOh\n3ofaAynu480x4EK7e6dCsgBfhjjd295WETr6iZCn7cs6WqbbS0bLhZ+hUQKBgGSA\nIJIlzOnfKQ1HWhkG+G+g2mXoD2tdgeUByOet3aLW3TgwCiQzo7lTrzC5nbrWVT5R\nq0aAEz9IJ5F4WVZsyp3vOmgAvlaZ3Jf3egIFVDk9TyRMxCsNhtHR2U6eRj1kA4DR\na6d+KjxJWvLacmne2sykE3i/p8nY8boUo4Z0oZJ7AoGATf3aT46x7xZUxb+0tfUJ\njF0w5AULLVtJbR+G/U6msN1J8FVE3OSdDcaEj6+VCSWYmk+JOq4aJy1/IrVSBAfe\nQUJCV3Dxo+f4udurgU5WubXtU/gEgwthnp3mRrO3p1FKA4MlKFvpcojxb/etSlJK\nY6Y3vAEqh1bIPm/hVOQ8gEw=\n-----END PRIVATE KEY-----\n',
	client_email:
		'virtial-classroom-gstorage@virtial-classroom.iam.gserviceaccount.com',
	client_id: '101582653349831105281',
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url:
		'https://www.googleapis.com/robot/v1/metadata/x509/virtial-classroom-gstorage%40virtial-classroom.iam.gserviceaccount.com',
};

const storage = new Storage({ projectId: keys.project_id, credentials: keys });

exports.storage = storage;
