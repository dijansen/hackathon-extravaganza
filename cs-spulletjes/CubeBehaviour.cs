using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CubeBehaviour : MonoBehaviour {

    Color[] colors = new Color[] { Color.yellow, Color.cyan, Color.green, Color.blue, Color.magenta };

    Color oldColor = Color.black;

    // Use this for initialization
    void Start () {
        int i = RandomUtils.random.Next(0, 5);
        transform.gameObject.GetComponent<Renderer>().material.color = colors[i];
    }
	
	// Update is called once per frame
	void Update () {
        transform.Rotate(new Vector3(1, 1, 1));
    }

    //private void OnMouseEnter()
    //{
    //    oldColor = transform.gameObject.GetComponent<Renderer>().material.color;
    //    transform.gameObject.GetComponent<Renderer>().material.color = Color.red;
    //}

    //private void OnMouseExit()
    //{
    //    transform.gameObject.GetComponent<Renderer>().material.color = oldColor;
    //}

    private void OnTriggerEnter(Collider other)
    {
        // This returns some stuff back to the front-end theoretically
        Application.ExternalCall("retrieved", "Cube", transform.gameObject.GetComponent<Renderer>().material.color, transform.position);
        Destroy(transform.gameObject);
    }
}
