
// // async function getpcdetails(){
// //     const res =await fetch('http://localhost:4000/pcdetails')

import Link from "next/link";

// //     return res.json()
// // }

// // export default async function getpc(){

// //     const pcs = await getpcdetails()

// //     return(
// //         <>
// //         {pcs.map((pc)=>(
// //             <div key={pc.product_id}>

// //                 <h3>{pc.name}</h3>
// //                 <h3>{pc.price}</h3>
// //                 <h3>{pc.photo}</h3>
// //                 <h3>{pc.description}</h3>

// //             </div>
// //         ))}
// //         {pcs.length === 0 &&(
// //             <p>there are no opne</p>
// //         )}
// //         </>
// //     )
// // }

// type PcDetails = {
//     product_id: string;
//     name: string;
//     price: number;
//     photo: string;
//     description: string;
// };

// async function getPcDetails(): Promise<PcDetails[]> {
//     try {
//         const res = await fetch('http://localhost:4000/pcdetails',{
//             next:{
//                 revalidate:0
//             }
//         })
            
        
//         if (!res.ok) {
//             throw new Error("Failed to fetch data");
//         }
//         return await res.json();
//     } catch (error) {
//         console.error("Error fetching PC details:", error);
//         return [];
//     }
// }

// export default async function GetPc() {
//     const pcs: PcDetails[] = await getPcDetails();

//     return (
//         <>
//             {pcs.length > 0 ? (
//                 pcs.map((pc: PcDetails) => (
//                     <div key={pc.product_id}>
//                         <h3>{pc.name}</h3>
//                         <p>Price: ${pc.price}</p>
//                         <img src={pc.photo} alt={pc.name} style={{ width: "200px", height: "auto" }} />
//                         <p>{pc.description}</p>
//                     </div>
//                 ))
//             ) : (
//                 <p>No PCs available.</p>
//             )}
//         </>
//     );
   
// }

type PcDetails = {
    // product_id: string;
    id: string;
    name: string;
    price: number;
    photo: string;
    description: string;
};

async function getPcDetails(): Promise<PcDetails[]> {
    try {
        const res = await fetch('http://localhost:4000/pcdetails', {
            next: { revalidate: 0 }
        });

        if (!res.ok) {
            throw new Error("Failed to fetch data");
        }
        return await res.json();
    } catch (error) {
        console.error("Error fetching PC details:", error);
        return [];
    }
}

export default async function GetPc() {
    const pcs: PcDetails[] = await getPcDetails();



    return (
        <section className="w-full bg-white py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12">
                    {/* Title and Description */}
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                            Our Products
                        </h2>
                        <p className="text-gray-600">Browse our premium selection of products</p>
                    </div>
                </div>
    
                {/* Grid for Products */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {pcs.length > 0 ? (
                        pcs.map((pc: PcDetails) => (
                            <Link key={pc.id} href={`/productpc/${pc.id}`} passHref>
                                <div
                                    className="group relative overflow-hidden rounded-lg bg-gray-100 transition-all duration-300 hover:shadow-xl"
                                >
                                    {/* Product Image Section */}
                                    <div className="aspect-[4/3] overflow-hidden">
                                        <img
                                            src={pc.photo}
                                            alt={pc.name}
                                            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                                        />
                                    </div>
    
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    
                                    {/* Product Details */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                        <h3 className="text-xl font-semibold mb-2 text-white-800">{pc.name}</h3>
                                        <p className="text-lg font-medium mb-2 text-white-700">${pc.price}</p>
                                        <p className="text-sm text-white-600">{pc.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="col-span-3 text-center text-gray-500">No PCs available.</p>
                    )}
                </div>
            </div>
        </section>
    );
    
    
}

