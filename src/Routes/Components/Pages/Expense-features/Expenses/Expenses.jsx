import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../AuthProvider/AuthProvider";
// import { AuthContext } from "../../../AuthProvider/AuthProvider"; // Import AuthContext

const Expenses = () => {
   const { user } = useContext(AuthContext); // Get the user context
   const [expenses, setExpenses] = useState([]);
   const [filteredExpenses, setFilteredExpenses] = useState([]);

   useEffect(() => {
      const fetchExpenses = async () => {
         try {
            const response = await axios.get("http://localhost:5000/expenses");
            setExpenses(response.data);
         } catch (error) {
            console.error("Error fetching expenses:", error);
         }
      };

      fetchExpenses();
   }, []);

   useEffect(() => {
      // Filter the expenses based on the user's email
      if (user?.email) {
         const filtered = expenses.filter(expense => expense.email === user.email);
         setFilteredExpenses(filtered);
      } else {
         setFilteredExpenses([]);
      }
   }, [expenses, user?.email]); // Filter when expenses or user email changes

   return (
      <div className="min-h-screen flex flex-col items-center bg-[#fefdec] p-6">
         <h2 className="text-3xl font-bold text-[#4c1a36] mb-6">📊 My Expenses</h2>
         <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 border border-[#dfab81]">
            {filteredExpenses.length > 0 ? (
               <ul className="space-y-4">
                  {filteredExpenses.map((expense) => (
                     <li
                        key={expense._id}
                        className="flex justify-between items-center p-4 border-b border-[#dfab81]"
                     >
                        <span className="text-lg text-[#4c1a36] font-semibold">
                           {expense.category} - ৳{expense.amount}
                        </span>
                        <span className="text-sm text-gray-600">{expense.dateTime}</span>
                     </li>
                  ))}
               </ul>
            ) : (
               <p className="text-gray-500 text-center">No expenses added yet.</p>
            )}
         </div>
      </div>
   );
};

export default Expenses;
