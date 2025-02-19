// async function get(id: string) {
    
//         const res = await fetch('http://localhost:4000/pcdetails/' + id, {
//             next:{
//                 revalidate:0
//             }
//         })
//         return res.json()
// }

// export default async function getpcdetails((params)){
//     const pc = await get(params.id)

//     return(
//         <div>{id}</div>
//     )
// }




// async function get(id: string) {
//     const res = await fetch('http://localhost:4000/pcdetails' + id, {
//         next: {
//             revalidate: 0
//         }
//     });

//     if (!res.ok) {
//         throw new Error('Failed to fetch PC details');
//     }

//     return res.json();
// }

// export default async function getpcdetails({ params }: { params: { id: string } }) {
//     const pc = await get(params.id);

//     return (
//         <div>
//             {/* Displaying PC details */}
//             <h2>{pc.name}</h2>
//             <p>{pc.description}</p>
//             <p>Price: ${pc.price}</p>
//             <img src={pc.photo} alt={pc.name} style={{ width: "200px", height: "auto" }} />
//         </div>
//     );
// }



// Define an async function to fetch PC details by ID
// async function get(id: string) {
//     const res = await fetch(`http://localhost:4000/pcdetails/${id}`, {
//         next: {
//             revalidate: 0,
//         },
//     });

//     if (!res.ok) {
//         throw new Error('Failed to fetch PC details');
//     }

//     return res.json();
// }


// export default async function GetPcDetails({ params }: { params: { id: string } }) {
    
//     const pc = await get(params.id);

    
//     return (
//         <div>
//             <h2>{pc.name}</h2>
//             <p>{pc.description}</p>
//             <p>Price: ${pc.price}</p>
//             <img src={pc.photo} alt={pc.name} style={{ width: '200px', height: 'auto' }} />
//         </div>
//     );
// }


// Fetching function
async function getPcDetails(id: string) {
    const res = await fetch(`http://localhost:4000/pcdetails/${id}`, {
        next: {
            revalidate: 0,  // Optional: revalidate the page on every request
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch PC details');
    }

    return res.json();
}

// Define the page component for displaying PC details
export default async function GetPcDetails({ params }: { params: { id: string } }) {
    // Fetch the PC details using the provided ID from the params
    const pc = await getPcDetails(params.id);

    // Return the JSX for rendering the PC details
    // return (
    //     <div className="product-details">
    //         <h2 className="text-3xl font-bold mb-4">{pc.name}</h2>
    //         <p className="text-lg mb-4">{pc.description}</p>
    //         <p className="text-xl font-medium mb-4">Price: ${pc.price}</p>
    //         <img 
    //             src={pc.photo} 
    //             alt={pc.name} 
    //             className="mb-4" 
    //             style={{ width: '300px', height: 'auto' }} 
    //         />
    //     </div>
    // );

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 bg-white  rounded-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start">
                {/* Product Image Section */}
                <div className="w-full md:w-1/3 mb-8 md:mb-0">
                    <img 
                        src={pc.photo} 
                        alt={pc.name} 
                        className="w-full h-full object-cover rounded-lg shadow-md"
                        style={{ height: 'auto', maxHeight: '400px' }}
                    />
                </div>

                {/* Product Details Section */}
                <div className="md:w-2/3 md:ml-8">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">{pc.name}</h2>
                    <p className="text-lg text-gray-700 mb-6">{pc.description}</p>
                    <p className="text-xl font-medium text-gray-900 mb-6">Price: <span className="text-green-500">${pc.price}</span></p>
                    
                    {/* Pay Now Button */}
                    <div className="flex items-center space-x-4">
                        

                        {/* Optionally add a "Add to Cart" button */}
                        <button 
                            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300 transition duration-300"
                            // onClick={() => alert('Added to cart')}
                        >
                            Pay Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



