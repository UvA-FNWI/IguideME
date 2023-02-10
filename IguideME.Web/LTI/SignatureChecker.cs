// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Security.Cryptography;
// using System.Text;

// namespace IguideME.Web.LTI
// {
//     /// <summary>
//     /// Computers and verified OAuth signatures
//     /// </summary>
//     class SignatureChecker
//     {
//         readonly string _key;

//         public SignatureChecker(string key)
//         {
//             this._key = key;
//         }

//         public bool CheckSignature(string method, string url, IEnumerable<KeyValuePair<string, string>> pars, string signature)
//             => GetSignature(method, url, pars) == signature;

//         public string GetSignature(string method, string url, IEnumerable<KeyValuePair<string, string>> pars)
//         {
//             var parString = string.Join('&',
//                 pars.OrderBy(p => p.Key)
//                     .Where(p => p.Key != "oauth_signature")
//                     .Select(p => $"{Uri.EscapeDataString(p.Key)}={Uri.EscapeDataString(p.Value)}")
//                 );
//             var sigBase = $"{method.ToUpper()}&{Uri.EscapeDataString(url)}&{Uri.EscapeDataString(parString)}";

//             return GetSha1Hash(sigBase);
//         }

//         string GetSha1Hash(string message)
//         {
//             var encoding = Encoding.UTF8;

//             byte[] keyBytes = encoding.GetBytes(_key + "&");
//             byte[] messageBytes = encoding.GetBytes(message);

//             using HMACSHA1 hmac = new HMACSHA1(keyBytes);
//             var hash = hmac.ComputeHash(messageBytes);
//             return Convert.ToBase64String(hash);
//         }
//     }
// }
