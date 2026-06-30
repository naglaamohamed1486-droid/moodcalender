export default function SavedTrips() {
const duplicateTrip = (index) => {

const copy = structuredClone(savedTrips[index]);

copy.name += " Copy";

setSavedTrips(prev=>[
...prev,
copy
]);

const deleteTrip=(index)=>{

setSavedTrips(
prev=>prev.filter((_,i)=>i!==index)
);

}
};
  return (
    <div style={{ padding: "20px" }}>
      <h1> SavedTrips Page</h1>
      <p>This page is working correctly 🚀</p>
    </div>
  );
}