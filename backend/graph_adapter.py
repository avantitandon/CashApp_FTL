import pandas as pd
from graphing_data import GraphingData

class GraphAdapter:
    def __init__(self, revenue_past_biased_data: GraphingData, revenue_predicted_biased_data: GraphingData, revenue_past_unbiased_data: GraphingData ,revenue_predicted_unbiased_data: GraphingData):
        self.revenue_past_biased_data = revenue_past_biased_data
        self.revenue_past_unbiased_data = revenue_past_unbiased_data
        self.revenue_predicted_biased_data = revenue_predicted_biased_data
        self.revenue_predicted_unbiased_data = revenue_predicted_unbiased_data

    
    @staticmethod
    def helper_df_to_dict(df_to_convert: pd.DataFrame) -> list[dict]:
        return df_to_convert.to_dict('records')
    def getPastUnbiasedLine(self):
        return self.helper_df_to_dict(self.revenue_past_unbiased_data.get_data())
    def getPredictedUnbiasedLine(self):
        return self.helper_df_to_dict(self.revenue_predicted_unbiased_data.get_data())
    def getPastBiasedLine(self):
        return self.helper_df_to_dict(self.revenue_past_biased_data.get_data())
    def getPredictedBiasedLine(self):
        return self.helper_df_to_dict(self.revenue_predicted_unbiased_data.get_data())
    

    

        
    



