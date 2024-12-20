import pandas as pd
from entity.graphing_data import GraphingData


class DataFormatter:
    """
    A class used to format and process transaction data.

    Attributes
    ----------
    _df : pd.DataFrame
        A copy of the DataFrame to be formatted.

    Methods
    -------
    __init__(df_to_format: pd.DataFrame)
        Initializes the DataFormatter with a DataFrame to format.

    get_formatted_df() -> pd.DataFrame
        Returns the formatted DataFrame.

    unbias() -> 'DataFormatter'
        Removes bias by flipping FP to TN, only for 'Bias' rows.

    _unbias_row(row)
        Static method to unbias a single row.

    filter_by(filter_gender: str = None, filter_race: str = None,
     filter_state: str = None) -> 'DataFormatter'
        Filters the DataFrame based on gender, race, or state.

    filter_invalid_transactions() -> 'DataFormatter'
        Creates a new dataset without any rows marked as blocked (i.e. False
        Positive (incorrectly blocked), True Positive (correctly blocked)).

    _clean_data() -> 'DataFormatter'
        Removes any columns with missing values and converts the 'Timestamp'
        column to a datetime object.

    get_revenue_data() -> GraphingData
        Returns a GraphingData object with the revenue data.

    get_frequency_data() -> GraphingData
        Returns a GraphingData object with the frequency data.
    """
    _df: pd.DataFrame

    def __init__(self, df_to_format: pd.DataFrame):
        self._df = df_to_format.copy()

    def get_formatted_df(self) -> pd.DataFrame:
        return self._df

    def get_revenue_data(self) -> GraphingData:
        """Returns a GraphingData object with the revenue data."""
        self._clean_data()

        revenue_df = self._df.groupby(self._df['date']).agg(
            revenue=('Transaction_Amount_USD', 'sum')
        ).reset_index()

        return GraphingData(revenue_df)

    def get_frequency_data(self) -> GraphingData:
        """Returns a GraphingData object with the frequency data."""
        self._clean_data()

        frequency_df = self._df.groupby(self._df['date']).agg(
            frequency=('Transaction_Amount_USD', 'count')
        ).reset_index()

        return GraphingData(frequency_df)

    def _clean_data(self) -> 'DataFormatter':
        """Remove any columns with missing values
         Convert the 'Timestamp' column to a datetime object."""
        if 'Timestamp' in self._df.columns:
            self._df = self._df.dropna(axis=1)
            self._df['Timestamp'] = pd.to_datetime(self._df['Timestamp']).dt.date
            self._df = self._df.rename(columns={'Timestamp': 'date'})
        return self

    # TODO: delete
    ##########################################################
    # Outdated code to use in future refactored objects.
    ##########################################################
    @staticmethod
    def helper_df_to_dict(df_to_convert: pd.DataFrame) -> list[dict]:
        """Converts a DataFrame to a list of dictionaries.
        """
        return df_to_convert.to_dict('records')

    @staticmethod
    def helper_datetime_to_string(df_to_convert: pd.DataFrame) -> pd.DataFrame:
        df_to_convert['date'] = pd.to_datetime(df_to_convert['date']).dt.strftime('%Y-%m-%d')
        return df_to_convert

    def _helper_output_df_format(self) -> tuple[pd.DataFrame, pd.DataFrame]:
        """Helper function to format the DataFrame for output.

        This function cleans the DataFrame, groups the data by date, and
        aggregates the number of transactions and total revenue. Making two
        dataframes with only the columns we care about.
        """
        self._clean_data()

        frequency_df = self._df.groupby(self._df['date']).agg(
            frequency=('Transaction_Amount_USD', 'count')
        ).reset_index()

        revenue_df = self._df.groupby(self._df['date']).agg(
            revenue=('Transaction_Amount_USD', 'sum')
        ).reset_index()

        return frequency_df, revenue_df

    def get_for_display(self) -> tuple[list[dict], list[dict]]:
        """Formats the data for output, and converts to list of dictionaries"""
        frequency_df, revenue_df = self._helper_output_df_format()
        frequency_df = DataFormatter.helper_datetime_to_string(frequency_df)
        revenue_df = DataFormatter.helper_datetime_to_string(revenue_df)

        display_format = (DataFormatter.helper_df_to_dict(frequency_df),
                          DataFormatter.helper_df_to_dict(revenue_df))

        return display_format

    #
    #
    # def get_for_predicting(self) -> tuple[pd.DataFrame, pd.DataFrame]:
    #     """Formats the data for out."""
    #     frequency_df, revenue_df = self._helper_output_df_format()
    #
    #     frequency_df = DataFormatter._add_back_missing(frequency_df)
    #     revenue_df = DataFormatter._add_back_missing(revenue_df)
    #
    #     return frequency_df, revenue_df
